import { whoAmI } from "@/app/_lib/auth/ory/kratos"
import { NextRequest, NextResponse } from "next/server"

const baseURL = process.env.HYDRA_ADMIN_URL

// Helper function to extract session data
const extractSession = (identity: any, grantScope: string[]) => {
  const session: any = {
    access_token: {
      roles: identity.metadata_public.roles,
      scope: grantScope,
      authorities: identity.metadata_public.authorities,
      sources: identity.metadata_public.sources,
      user_name: identity.metadata_public.mp_login,
    },
    id_token: {
      email: identity.traits.email
    },
  }
  return session
}

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

function getConsentRequest(consentChallenge: string) {
  let url = new URL(`${baseURL}/oauth2/auth/requests/consent`)
  url.search = new URLSearchParams([['consent_challenge', consentChallenge]]).toString()
  return fetch(url)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ consent_challenge: string }> }
) {
  const consentChallenge = request.nextUrl.searchParams.get('consent_challenge') ?? undefined
  if (consentChallenge == undefined) {
    return NextResponse.json({ 'error': 'No consent_challenge param provided' }, { status: 401 })
  }

  return getConsentRequest(consentChallenge)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ consent_challenge: string }> }
) {
  let oryUser: any
  let userId: string
  let identity: any
  try {
    const resp = await whoAmI()
    if (resp.status != 200) {
      return NextResponse.json({ error: { type: 'authentication', content: { message: "No user session" } } }, { status: 403 })
    }
    oryUser = await resp.json()
    userId = getUserId(oryUser)
    identity = oryUser['identity']
  } catch {
    return NextResponse.json({ error: { type: 'authentication', content: { message: "Error decoding user session" } } }, { status: 403 })
  }

  const consentChallenge = request.nextUrl.searchParams.get('consent_challenge') ?? undefined
  if (consentChallenge == undefined) {
    return NextResponse.json({ 'error': 'No consent_challenge param provided' }, { status: 401 })
  }
  const { consentAction, grantScope, remember } = await request.json()
  const consentRequest = await getConsentRequest(consentChallenge)
  const consentBody = await consentRequest.json()
  const grant_access_token_audience = consentBody.requested_access_token_audience

  if (!consentChallenge || !consentAction) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 401 })
  }


  let url: URL
  let body: any
  let session: any

  try {
    session = extractSession(identity, grantScope)
  } catch (e) {
    console.log(e)
    return NextResponse.json({error: {type: 'session', content: { message: "User session could not be converted into token, may not have required role"}}}, {status: 403})
  }

  if (consentAction == "accept") {
    url = new URL(`${baseURL}/oauth2/auth/requests/consent/accept`)
    url.search = new URLSearchParams([['consent_challenge', consentChallenge]]).toString()
    body = {
      grant_scope: grantScope,
      grant_access_token_audience: grant_access_token_audience,
      session,
      remember: Boolean(remember),
      remember_for: 3600
    }
  } else {
    url = new URL(`${baseURL}/oauth2/auth/requests/consent/accept`)
    url.search = new URLSearchParams([['consent_challenge', consentChallenge]]).toString()
    body = {
      error: "request_denied",
    }
  }
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
  return NextResponse.json(await response.json())
}
