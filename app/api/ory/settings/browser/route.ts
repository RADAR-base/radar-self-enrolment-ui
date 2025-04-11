import { createSettingsFlow } from "@/app/_lib/auth/ory/kratos"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  return await createSettingsFlow()
}