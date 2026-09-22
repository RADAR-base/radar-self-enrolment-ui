import { NextRequest, NextResponse } from "next/server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { ArmtDefinitionRepository, getDefinition } from '@/app/_lib/armt/repository/repository';
import { schemaFromDefinition } from "@/app/_lib/armt/validation/parser";
import fromRedcapDefinition from "@/app/_lib/armt/definition/fromRedcapDefinition";
import { getAuthenticatedUser } from "@/app/_lib/auth/session";
import { ActiveTaskResponse } from "@/app/_lib/armt/response/response.interface";

async function sendTaskResponse(studyId: string, userId: string, taskData: ActiveTaskResponse) {
  return await fetch(process.env.KRATOS_ADMIN_URL + '/identities/' + userId, {
    method: 'PATCH',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{
      op: 'add',
      path: '/metadata_admin/study/' + studyId + '/tasks/' + taskData.id,
      value: taskData
    }])
  })
}

async function getTask(studyId: string, userId: string, taskId: string) {
  const resp = await fetch(process.env.KRATOS_ADMIN_URL + '/identities/' + userId)
  if (resp.ok) {
    try {
      const userData = await resp.json()
      return userData['metadata_admin']['study'][studyId]['tasks'][taskId]
    } catch {
      return null
    }
  }
  return null
}

async function getProtocolAndAuth(studyId: string) {
  const repository = new StudyProtocolRepository()
  const protocol = await repository.getStudyProtocol(studyId)
  if (!protocol) {
    return { error: NextResponse.json({error: {type: 'request', content: 'No such study exists'}}, {status: 400}) }
  }
  const auth = await getAuthenticatedUser()
  if (!auth.ok) {
    return { error: auth.response }
  }
  return { protocol, userId: auth.user.kratosId }
}

async function buildTaskData(
  protocol: any,
  taskId: string,
  values: any,
): Promise<ActiveTaskResponse | NextResponse> {
  const taskProtocol = protocol.protocols.find((e: any) => e.id === taskId)
  if (!taskProtocol) {
    return NextResponse.json({error: {type: 'request', content: 'No such task'}}, {status: 400})
  }

  if (taskProtocol.metadata.type === "redcap_local") {
    const armtRepo = new ArmtDefinitionRepository(protocol)
    const redcapDef = await armtRepo.getDefinition(taskId)
    if (!redcapDef) {
      return NextResponse.json({error: {type: 'request', content: 'No such task'}}, {status: 400})
    }
    const armtDef = fromRedcapDefinition(redcapDef)
    const schema = schemaFromDefinition(armtDef)
    try {
      await schema.validate(values, { context: values })
    } catch (error) {
      return NextResponse.json({error: {type: 'validation', content: error}}, {status: 400})
    }
    return {
      id: armtDef.id,
      name: armtDef.name,
      time: Date.now(),
      version: '',
      answers: taskProtocol.metadata.type === "redcap_local"
        ? Object.fromEntries(
            armtDef.items
              .filter((item: any) => item.content.fieldType !== 'descriptive')
              .map((item: any) => [item.content.id, values[item.content.id]])
          )
        : values,
    }
  }

  return { id: taskId, name: taskId, time: Date.now(), version: '', answers: values }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string, taskId: string }> }
) {
  const { studyId, taskId } = await params
  const ctx = await getProtocolAndAuth(studyId)
  if ('error' in ctx) return ctx.error

  const task = await getTask(studyId, ctx.userId, taskId)
  return NextResponse.json(task)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string, taskId: string }> }
) {
  const { studyId, taskId } = await params
  const ctx = await getProtocolAndAuth(studyId)
  if ('error' in ctx) return ctx.error

  const values = await request.json()
  const result = await buildTaskData(ctx.protocol, taskId, values)
  if (result instanceof NextResponse) return result

  await sendTaskResponse(studyId, ctx.userId, result)
  return new NextResponse(null, { status: 200 })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string, taskId: string }> }
) {
  const { studyId, taskId } = await params
  const ctx = await getProtocolAndAuth(studyId)
  if ('error' in ctx) return ctx.error

  const previousValues = (await getTask(studyId, ctx.userId, taskId))?.answers ?? {}
  const newValues = await request.json()
  const merged = { ...previousValues, ...newValues }

  const result = await buildTaskData(ctx.protocol, taskId, merged)
  if (result instanceof NextResponse) return result

  await sendTaskResponse(studyId, ctx.userId, result)
  return new NextResponse(null, { status: 200 })
}
