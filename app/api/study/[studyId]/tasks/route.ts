import ProtocolRepository, { StudyProtocolRepository } from "@/app/_lib/study/protocol/repository";
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studyId: string }> }
) {
  let registery: StudyProtocolRepository = new ProtocolRepository()
  const projectId = (await params).studyId
  const protocol = await registery.getStudyProtocol(projectId)
  if (protocol == undefined) {
    return NextResponse.json({error: "No such project", status: 400})
  }
  return NextResponse.json({body: protocol.protocols})
}
