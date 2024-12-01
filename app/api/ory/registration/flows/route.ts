import { getRegistrationFlow } from "@/app/_lib/auth/ory/kratos"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const flowId = request.nextUrl.searchParams.get('flow')
  if (flowId == null) {
    return NextResponse.json({error: 'No flow (flow id) param provided'}, {status: 400})
  }
  return await getRegistrationFlow(flowId)
}