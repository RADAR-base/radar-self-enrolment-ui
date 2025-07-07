import { NextRequest, NextResponse } from "next/server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { updateRegistrationFlow } from "@/app/_lib/auth/ory/kratos";
import { setStudyStatus } from "@/app/_lib/study/status";

type StudyJoinRequestBody = {
  email: string,
  password: string,
  csrf_token: string,
  traits: {[key: string]: any}
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string }> }
) {
  const {studyId }  = (await params)
  const {email, password, traits, csrf_token} = (await request.json()) as StudyJoinRequestBody
  
  const flowId = request.nextUrl.searchParams.get('flow')
  if (flowId == null) {
    return NextResponse.json({error: 'No flow (flow id) param provided'}, {status: 400})
  }

  var registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(studyId)
  if (protocol == undefined) {
    return NextResponse.json({error: 'No such study'}, {status: 400})
  }

  const data = {
    method: 'password',
    password: password,
    csrf_token: csrf_token,
    traits: {
      email: email,
      projects: [
        {
          id: studyId,
          name: protocol.name,
          userId: crypto.randomUUID(),
          ...traits,
          version: protocol.enrolment.version      
        }
      ]
    },
  }
  const registrationResponse = await updateRegistrationFlow(flowId, data)
  if (registrationResponse.ok) {
    const data = await registrationResponse.clone().json()
    await setStudyStatus(studyId, data['identity']['id'], 'enrolled')
  }
  return registrationResponse
}