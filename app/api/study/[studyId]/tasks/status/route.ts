import ProtocolRepository, { StudyProtocolRepository } from "@/app/_lib/study/protocol/repository";
import { StudyProtocol } from '@/app/_lib/study/protocol';
import { NextRequest, NextResponse } from "next/server"
import { whoAmI } from "@/app/_lib/auth/ory/kratos";
import { ActiveTaskResponse } from "@/app/_lib/armt/response/response.interface";

export interface ArmtStatus {
  id: string,
  due: boolean,
  lastCompleted?: Date
}

async function getExistingTasks(studyId: string, userId: string) {
  const r = await fetch(process.env.KRATOS_ADMIN_URL + '/admin/identities/' + userId, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    }
  })
  const data = (await r.json())['metadata_admin']
  if ((data == null) || (data['study'] == undefined) || (data['study'][studyId] == undefined))  {
    return {} as {[key: string]: ActiveTaskResponse}
  }
  return data['study'][studyId] as {[key: string]: ActiveTaskResponse}
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string }> }
) {
  let registery: StudyProtocolRepository = new ProtocolRepository()
  let protocol: StudyProtocol;
  const studyId = (await params).studyId
  try {
    protocol = await registery.getStudyProtocol(studyId)
  } catch {
    return NextResponse.json({error: "No such project", status: 404})
  }

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
  const existingTasks = await getExistingTasks(studyId, userId)
  let status: {[key: string]: ArmtStatus} = {}

  for (let index = 0; index < protocol.protocols.length; index++) {
    const armt = protocol.protocols[index]
    status[armt.id] = {
      id: armt.id,
      due: !(armt.id in existingTasks),
      lastCompleted: (armt.id in existingTasks) ? new Date(existingTasks[armt.id].time) : undefined
    }
  }
  return NextResponse.json(status)
}
