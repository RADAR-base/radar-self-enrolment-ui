import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/app/_lib/auth/session"
import { allTaskStatus } from "@/app/_lib/study/tasks/status"
import type { ArmtStatus } from "@/app/_lib/study/tasks/types"

export type { ArmtStatus }

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string }> }
) {
  const auth = await getAuthenticatedUser()
  if (!auth.ok) return auth.response

  const status = await allTaskStatus((await params).studyId, auth.user.kratosId)
  if (status == null) {
    return NextResponse.json({error: {type: 'unknown', content: {message: "Task status could not be retrieved"}}}, {status: 400})
  }
  return NextResponse.json(status)
}
