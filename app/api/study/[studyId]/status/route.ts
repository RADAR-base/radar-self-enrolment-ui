import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/app/_lib/auth/session"

async function getStatus(studyId: string, userId: string) {
  const resp = await fetch(process.env.KRATOS_ADMIN_URL + '/identities/' + userId)
  if (resp.ok) {
    try {
      const userData = await resp.json()
      return userData['metadata_admin']['study'][studyId]['status']
    } catch {
      return null
    }
  }
  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string }> }
) {
  const { studyId } = await params
  const auth = await getAuthenticatedUser()
  if (!auth.ok) return auth.response

  const status = await getStatus(studyId, auth.user.kratosId)
  return NextResponse.json(status)
}
