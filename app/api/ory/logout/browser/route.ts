import { createLogoutFlow } from "@/app/_lib/auth/ory/kratos"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return await createLogoutFlow()
}