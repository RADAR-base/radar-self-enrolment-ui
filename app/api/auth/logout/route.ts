import { createLogoutFlow, updateLogoutFlow } from "@/app/_lib/auth/ory/kratos"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const cookieJar = cookies()

  const flowResponse = await createLogoutFlow()
  if (!flowResponse.ok) { return flowResponse}
  const flow = (await flowResponse.json())
  cookieJar.delete('sep_access_token')
  return await updateLogoutFlow(flow['logout_token'])
}