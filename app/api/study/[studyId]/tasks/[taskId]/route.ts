import { NextRequest, NextResponse } from "next/server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { ArmtDefinitionRepository, getDefinition } from '@/app/_lib/armt/repository/repository';
import { schemaFromDefinition } from "@/app/_lib/armt/validation/parser";
import fromRedcapDefinition from "@/app/_lib/armt/definition/fromRedcapDefinition";
import { withBasePath } from "@/app/_lib/util/links";
import { StudyProtocol } from "@/app/_lib/study/protocol";
import { whoAmI } from "@/app/_lib/auth/ory/api.server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string, taskId: string }> }
) {
  const {studyId, taskId}  = (await params)
  let protocol: StudyProtocol
  let oryUser: any
  try {
    const resp = await whoAmI()
    if (resp.status != 200) {
      return NextResponse.json({error: {type: 'authentication', content: {message: "No user session"}}}, {status: 403})
    }
    oryUser = await resp.json()
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

  return new NextResponse(null, {status: 200})
}