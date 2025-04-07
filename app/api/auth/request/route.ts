import { NextRequest, NextResponse } from "next/server"

const AUTH_BASE_URL = process.env.HYDRA_PUBLIC_URL + "/oauth2"
const SEP_REDIRECT_URI = process.env.NEXT_PUBLIC_SEP_REDIRECT_URI ?? ''
const ARMT_REDIRECT_URI = process.env.NEXT_PUBLIC_ARMT_REDIRECT_URI ?? ''
const ARMT_CLIENT_ID = process.env.ARMT_CLIENT_ID ?? 'aRMT'
const SEP_CLIENT_ID = process.env.SEP_CLIENT_ID ?? 'SEP'
const ARMT_SCOPES = [
  'SOURCETYPE.READ',
  'PROJECT.READ',
  'SUBJECT.READ',
  'SUBJECT.UPDATE',
  'MEASUREMENT.CREATE',
  'SOURCEDATA.CREATE',
  'SOURCETYPE.UPDATE',
  'offline_access'
]
const SEP_SCOPES = [
  "SOURCETYPE.READ",
  "PROJECT.READ",
  "SUBJECT.READ",
  "SUBJECT.UPDATE",
  "SUBJECT.CREATE"
]
const ARMT_AUDIENCE = ['res_ManagementPortal', 'res_gateway', 'res_AppServer']
const SEP_AUDIENCE = ['res_restAuthorizer']

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const clientId = searchParams.get("client_id")
  const responseType = "code"
  const redirectUri =
    clientId === SEP_CLIENT_ID ? SEP_REDIRECT_URI : ARMT_REDIRECT_URI
  const state = searchParams.get("state")
  const audience = clientId === SEP_CLIENT_ID ? SEP_AUDIENCE : ARMT_AUDIENCE
  const scopes = clientId === SEP_CLIENT_ID ? SEP_SCOPES : ARMT_SCOPES

  if (!clientId || !state) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    )
  }

  // Build auth URL
  const urlParams = new URLSearchParams({
    client_id: clientId,
    response_type: responseType,
    audience: audience.join(' '),
    scope: scopes.join(' '),
    redirect_uri: redirectUri,
    state,
  })

  const authUrl = `${AUTH_BASE_URL}/auth?${urlParams.toString()}`

  return NextResponse.json({ authUrl })
}
