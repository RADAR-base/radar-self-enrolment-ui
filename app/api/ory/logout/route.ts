import { updateLogoutFlow } from "@/app/_lib/auth/ory/kratos"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export interface oryLogoutParams {
  logout_token: string
  logout_url: string
}

export async function GET(request: NextRequest) {
  const logout_token = request.nextUrl.searchParams.get('logout_token')
  if (logout_token == null) {
    return NextResponse.json({error: 'No logout_token param provided'}, {status: 400})
  }
  (await cookies()).delete('sep_access_token')
  return await updateLogoutFlow(logout_token)
}