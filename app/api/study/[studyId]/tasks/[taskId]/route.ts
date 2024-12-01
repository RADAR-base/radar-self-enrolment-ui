import { NextRequest, NextResponse } from "next/server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { ArmtDefinitionRepository, getDefinition } from '@/app/_lib/armt/repository/repository';
import { schemaFromDefinition } from "@/app/_lib/armt/validation/parser";
import fromRedcapDefinition from "@/app/_lib/armt/definition/fromRedcapDefinition";
import { StudyProtocol } from "@/app/_lib/study/protocol";
import { whoAmI } from "@/app/_lib/auth/ory/kratos";
import { ActiveTaskResponse } from "@/app/_lib/armt/response/response.interface";

async function sendTaskResponse(studyId: string, userId: string, taskData: ActiveTaskResponse) {
  return await fetch(process.env.KRATOS_ADMIN_URL + '/admin/identities/' + userId, {
    method: 'PATCH',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{
      op: 'add',
      path: '/metadata_admin/study/' + studyId + '/' + taskData.id,
      value: taskData
    }])
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string, taskId: string }> }
) {
  const {studyId, taskId}  = (await params)
  let protocol: StudyProtocol
  let oryUser: any
  let userId: string
  try {
    const resp = await whoAmI()
    if (resp.status != 200) {
      return NextResponse.json({error: {type: 'authentication', content: {message: "No user session"}}}, {status: 403})
    }
    oryUser = await resp.json()
    userId = oryUser['identity']['id']
  } catch {
    return NextResponse.json({error: {type: 'authentication', content: {message: "Error decoding user session"}}}, {status: 403})
  }

  try {
    const registery: StudyProtocolRepository = new StudyProtocolRepository()  
    protocol = await registery.getStudyProtocol(studyId)
  } catch {
    return NextResponse.json({error: {type: 'request', content: 'No such study exists'}}, {status: 400})
  }

  const armtRepo = new ArmtDefinitionRepository(protocol)
  const redcapDef = await armtRepo.getDefinition(taskId)
  if (redcapDef == undefined) {
    return NextResponse.json({error: {type: 'request', content: 'No such task'}} , {status: 400})
  }
  const armtDef = fromRedcapDefinition(redcapDef)
  const values = (await request.json())
  const schema = schemaFromDefinition(armtDef)
  try {
    await schema.validate(values)
  } catch (error) {
    return NextResponse.json({error: {type: 'validation', content: error}} , {status: 400})
  }
  let taskData = {
    'id': armtDef.id,
    'name': armtDef.name,
    'time': Date.now(),
    'version': '',
    'answers': values
  } as ActiveTaskResponse
  await sendTaskResponse(studyId, userId, taskData)
  return new NextResponse(null, {status: 200})
}