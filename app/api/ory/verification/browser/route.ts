import { createVerificationFlow } from "@/app/_lib/auth/ory/kratos"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const return_to = request.nextUrl.searchParams.get('return_to') ?? undefined
  return await createVerificationFlow(return_to)
}