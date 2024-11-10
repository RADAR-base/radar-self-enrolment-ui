import { createLogoutFlow } from "@/app/_lib/auth/ory/api.server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return await createLogoutFlow()
}