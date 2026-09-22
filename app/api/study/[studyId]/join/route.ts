import { NextRequest, NextResponse } from "next/server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { updateRegistrationFlow } from "@/app/_lib/auth/ory/kratos";
import { getProjectStatus } from "@/app/_lib/study/projectStatus";

const DELEGATE_API_URL = process.env.DELEGATE_API_URL

type StudyJoinRequestBody = {
  email: string,
  password: string,
  csrf_token: string,
  traits: {[key: string]: any}
}

async function createParticipant(studyId: string): Promise<string> {
  if (!DELEGATE_API_URL) {
    throw new Error('DELEGATE_API_URL is not configured')
  }
  const res = await fetch(
    `${DELEGATE_API_URL}/projects/${encodeURIComponent(studyId)}/participants`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } },
  )
  if (!res.ok) {
    throw new Error(`Failed to create participant: ${res.statusText}`)
  }
  const data = await res.json()
  return data.userId
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string }> }
) {
  const {studyId }  = (await params)

  const projectResult = await getProjectStatus(studyId)
  if (projectResult.status === 'not_found') {
    return NextResponse.json({error: 'No such project'}, {status: 404})
  }
  if (projectResult.status === 'found' && !projectResult.data.acceptingEnrolment) {
    return NextResponse.json({error: 'Enrolment is closed for this study'}, {status: 403})
  }

  const {email, password, traits, csrf_token} = (await request.json()) as StudyJoinRequestBody

  const flowId = request.nextUrl.searchParams.get('flow')
  if (flowId == null) {
    return NextResponse.json({error: 'No flow (flow id) param provided'}, {status: 400})
  }

  const registery = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(studyId)
  if (protocol == undefined) {
    return NextResponse.json({error: 'No such study'}, {status: 400})
  }

  let userId: string
  try {
    userId = await createParticipant(studyId)
  } catch (error) {
    console.error('Failed to create participant:', error)
    return NextResponse.json({error: 'Failed to create participant'}, {status: 500})
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
          userId,
          ...traits,
          version: protocol.enrolment.version
        }
      ]
    },
  }
  return await updateRegistrationFlow(flowId, data)
}