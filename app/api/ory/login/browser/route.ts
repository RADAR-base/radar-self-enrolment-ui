import { createLoginFlow } from "@/app/_lib/auth/ory/kratos"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const login_challenge = request.nextUrl.searchParams.get('login_challenge') ?? undefined
  // const refresh = request.nextUrl.searchParams.get('refresh') ?? undefined
  return await createLoginFlow({login_challenge: login_challenge})
}