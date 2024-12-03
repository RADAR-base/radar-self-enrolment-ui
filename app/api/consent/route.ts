import { NextRequest, NextResponse } from "next/server"

const baseURL = process.env.HYDRA_ADMIN_URL

// Helper function to extract session data
const extractSession = (identity: any, grantScope: string[]) => {
  const session: any = {
    access_token: {
      roles: identity.metadata_public.roles,
      scope: identity.metadata_public.scope,
      authorities: identity.metadata_public.authorities,
      sources: identity.metadata_public.sources,
      user_name: identity.metadata_public.mp_login,
    },
    id_token: {},
  }
  return session
}

function getConsentRequest(consentChallenge: string) {
  let url = new URL(`${baseURL}/admin/oauth2/auth/requests/consent`)
  url.search = new URLSearchParams([['consent_challenge', consentChallenge]]).toString()
  return fetch(url)
}

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ consent_challenge: string }> }
) {
  const consentChallenge = request.nextUrl.searchParams.get('consent_challenge') ?? undefined
  if (consentChallenge == undefined) {
    return NextResponse.json({'error': 'No consent_challenge param provided'}, {status: 401})
  }

  return getConsentRequest(consentChallenge)
}

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ consent_challenge: string }> }
) {
  const consentChallenge = request.nextUrl.searchParams.get('consent_challenge') ?? undefined
  if (consentChallenge == undefined) {
    return NextResponse.json({'error': 'No consent_challenge param provided'}, {status: 401})
  }
  const { consentAction, grantScope, remember, identity } = await request.json()

  const session = extractSession(identity, grantScope)

  const consentRequest = await getConsentRequest(consentChallenge)
  const consentBody = await consentRequest.json()
  const grant_access_token_audience = consentBody.requested_access_token_audience

  if (!consentChallenge || !consentAction) {
    return NextResponse.json({error: 'Missing required parameters'}, {status: 401})
  }

  if (consentAction == "accept") {
    let url = new URL(`${baseURL}/admin/oauth2/auth/requests/consent/accept`)
    url.search = new URLSearchParams([['consent_challenge', consentChallenge]]).toString()
    const body = {
      grant_scope: grantScope,
      grant_access_token_audience: grant_access_token_audience,
      session,
      remember: Boolean(remember),
      remember_for: 3600
    }
    const acceptResponse = await fetch(url, {
      method: 'PUT',
      headers: { 
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    const acceptBody = await acceptResponse.json()
    return NextResponse.json(acceptBody)
  }
}
