import { createRecoveryFlow } from "@/app/_lib/auth/ory/kratos"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const return_to = request.nextUrl.searchParams.get('return_to') ?? undefined
  return await createRecoveryFlow(return_to)
}