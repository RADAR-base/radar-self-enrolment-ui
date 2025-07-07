import { NextRequest, NextResponse } from "next/server"
import { whoAmI } from "@/app/_lib/auth/ory/kratos";

async function getStatus(studyId:string, userId: string) {
  const resp = await fetch(process.env.KRATOS_ADMIN_URL + '/identities/' + userId)
  if (resp.ok) {
    try {
      const userData = await resp.json()
      const currentValue = userData['metadata_admin']['study'][studyId]['status']
      return currentValue
    } catch {
      return null
    }
  }
  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string, taskId: string }> }
) {
  const {studyId, taskId}  = (await params)
  let oryUser: any
  let userId: string

  try {
    const resp = await whoAmI()
    if (resp.status != 200) {
      return NextResponse.json({error: {type: 'authentication', content: {message: "No user session"}}}, {status: 403})
    }
    oryUser = await resp.json()
    userId = oryUser['identity']['id']
  } catch {
    return NextResponse.json({error: {type: 'authentication', content: {message: "Error decoding user session"}}}, {status: 403})
  }
  const task = getStatus(studyId, userId)
  return NextResponse.json(task)
}