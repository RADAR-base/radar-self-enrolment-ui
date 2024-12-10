import { whoAmI } from "@/app/_lib/auth/ory/kratos"
import { NextRequest, NextResponse } from "next/server"

const baseURL = process.env.HYDRA_ADMIN_URL

function userIsParticipant(userSession: any): boolean {
  return userSession?.identity?.schema_id == "subject"
}

function getUserId(userSession: any): string {
  if (userIsParticipant(userSession)) {
    const projects: any[] = userSession?.identity?.traits?.projects
    return projects[0]?.userId
  }
  return userSession?.identity?.id
}

export async function POST(
  request: NextRequest, 
) {
  let oryUser: any
  let userId: string

  try {
    const resp = await whoAmI()
    if (resp.status != 200) {
      return NextResponse.json({error: {type: 'authentication', content: {message: "No user session"}}}, {status: 403})
    }
    oryUser = await resp.json()
    userId = getUserId(oryUser)
  } catch {
    return NextResponse.json({error: {type: 'authentication', content: {message: "Error decoding user session"}}}, {status: 403})
  }

  const loginChallenge = request.nextUrl.searchParams.get('login_challenge') ?? undefined
  if (loginChallenge == undefined) {
    return NextResponse.json({'error': 'No login_challenge param provided'}, {status: 401})
  }

  const { remember } = await request.json()
  try {
    const response = await fetch(
      `${baseURL}/admin/oauth2/auth/requests/login/accept?login_challenge=${loginChallenge}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          subject: userId,
          remember: remember
        })
      }
    )
    return response
  } catch (error) {
    console.log(error)
  }
  return new NextResponse('Error', {status: 401})
}