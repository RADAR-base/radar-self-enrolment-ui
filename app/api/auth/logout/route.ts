import { createLogoutFlow, updateLogoutFlow } from "@/app/_lib/auth/ory/kratos"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const flowResponse = await createLogoutFlow()
  if (!flowResponse.ok) { return flowResponse}
  const flow = (await flowResponse.json())
  return await updateLogoutFlow(flow['logout_token'])
}