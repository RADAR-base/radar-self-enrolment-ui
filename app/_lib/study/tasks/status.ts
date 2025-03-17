"use server"

import { ArmtStatus } from "@/app/api/study/[studyId]/tasks/status/route"
import { ActiveTaskResponse } from "../../armt/response/response.interface"
import { whoAmI } from "../../auth/ory/kratos"
import StudyProtocolRepository from "../protocol/repository"
import { StudyProtocol } from "../protocol"
import { notFound } from "next/navigation"

async function getExistingTasks(studyId: string, userId: string) {
  const r = await fetch(process.env.KRATOS_ADMIN_URL + '/identities/' + userId, {
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


export async function allTaskStatus(studyId: string, userId: string): Promise<{[key: string]: ArmtStatus} | null> {
  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(studyId)
  if (protocol == undefined) { 
    return null
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
  return status
}