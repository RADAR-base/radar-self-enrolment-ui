import { getRecoveryFlow } from "@/app/_lib/auth/ory/kratos"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const flowId = request.nextUrl.searchParams.get('flow')
  const token = request.nextUrl.searchParams.get('token')
  if (flowId == null) {
    return NextResponse.json({error: 'No flow (flow id) param provided'}, {status: 400})
  }
  return await getRecoveryFlow(flowId, token || undefined)
}
