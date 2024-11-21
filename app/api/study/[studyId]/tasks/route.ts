import ProtocolRepository, { StudyProtocolRepository } from "@/app/_lib/study/protocol/repository";
import { StudyProtocol } from '@/app/_lib/study/protocol';
import { NextRequest, NextResponse } from "next/server"
import { headers } from 'next/headers'
import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studyId: string }> }
) {
  let registery: StudyProtocolRepository = new ProtocolRepository()
  let protocol: StudyProtocol;
  const projectId = (await params).studyId
  try {
    protocol = await registery.getStudyProtocol(projectId)
  } catch {
    return NextResponse.json({error: "No such project", status: 400})
  }
  return NextResponse.json({body: protocol.protocols})
}
