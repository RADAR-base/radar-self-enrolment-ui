import { submitLoginFlow } from "@/app/_lib/auth/ory/api.server"
import { NextRequest, NextResponse } from "next/server"

export interface oryLoginParams {
  email: string,
  password: string,
  csrf_token: string,
}

export async function POST(request: NextRequest) {
  const flowId = request.nextUrl.searchParams.get('flow')
  if (flowId == null) {
    return NextResponse.json({error: 'No flow (flow id) param provided'}, {status: 400})
  }
  const {email, password, csrf_token} = (await request.json()) as oryLoginParams
  return submitLoginFlow(email, password, csrf_token, flowId)
}