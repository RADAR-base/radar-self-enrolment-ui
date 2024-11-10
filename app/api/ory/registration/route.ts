import { updateRegistrationFlow } from "@/app/_lib/auth/ory/api.server"
import { NextRequest, NextResponse } from "next/server"

export interface oryRegistrationParams {
  email: string,
  password: string,
  traits: {[key: string]: any},
  csrf_token: string
}

export async function POST(request: NextRequest) {
  console.log(request)
  const {email, password, traits, csrf_token} = (await request.json()) as oryRegistrationParams
  const flowId = request.nextUrl.searchParams.get('flow')
  if (flowId == null) {
    return NextResponse.json({error: 'No flow (flow id) param provided'}, {status: 400})
  }
  const data = {
    method: 'password',
    password: password,
    csrf_token: csrf_token,
    traits: {
      'email': email,
      ...traits
    },
  }
  return updateRegistrationFlow(flowId, data)
}