import { NextRequest, NextResponse } from "next/server"
import { whoAmI } from "@/app/_lib/auth/ory/kratos";
import { allTaskStatus } from "@/app/_lib/study/tasks/status";

export interface ArmtStatus {
  id: string,
  due: boolean,
  lastCompleted?: Date
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studyId: string }> }
) {
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

  const status = await allTaskStatus((await params).studyId, userId)
  if (status == null) { 
    return NextResponse.json({error: {type: 'unknown', content: {message: "Task status could not be retrieved"}}}, {status: 400})
  }
  return NextResponse.json(status)
}
