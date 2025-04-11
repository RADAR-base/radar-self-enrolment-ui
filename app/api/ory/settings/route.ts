import { completeSettingsFlow, updateRegistrationFlow } from "@/app/_lib/auth/ory/kratos"
import { NextRequest, NextResponse } from "next/server"

interface orySettingsParams {
  password: string,
  csrf_token: string
}

export async function POST(request: NextRequest) {
  const {password, csrf_token} = (await request.json()) as orySettingsParams
  const flowId = request.nextUrl.searchParams.get('flow')
  if (flowId == null) {
    return NextResponse.json({error: 'No flow (flow id) param provided'}, {status: 400})
  }
  const data = {
    password: password,
    csrf_token: csrf_token,
  }
  return completeSettingsFlow(flowId, data)
}