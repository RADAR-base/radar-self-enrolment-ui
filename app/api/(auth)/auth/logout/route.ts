import { createLogoutFlow, updateLogoutFlow } from "@/app/_lib/auth/ory/kratos"
import { clearAuthCookies } from "@/app/_lib/auth/clearAuthCookies"

export async function GET() {
  const flowResponse = await createLogoutFlow()
  if (!flowResponse.ok) return flowResponse

  const flow = await flowResponse.json()
  await clearAuthCookies()

  return await updateLogoutFlow(flow.logout_token)
}
