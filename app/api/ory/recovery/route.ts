import {  IUpdateRecoveryFlowBodyCode, IUpdateRecoveryFlowBodyEmail, updateRecoveryFlow } from "@/app/_lib/auth/ory/kratos"
import { NextRequest, NextResponse } from "next/server"

// export interface oryRecoveryParams {
//   email: string,
//   password: string,
//   csrf_token: string,
// }

export async function POST(request: NextRequest) {
  const flowId = request.nextUrl.searchParams.get('flow')
  if (flowId == null) {
    return NextResponse.json({error: 'No flow (flow id) param provided'}, {status: 400})
  }
  const data = (await request.json()) as (IUpdateRecoveryFlowBodyCode | IUpdateRecoveryFlowBodyEmail)
  return updateRecoveryFlow(flowId, data)
}