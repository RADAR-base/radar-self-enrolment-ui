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
  const { consent_challenge: consentChallenge } = (await params)
  return getConsentRequest(consentChallenge)
}

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ consent_challenge: string }> }
) {
  const { consent_challenge: consentChallenge } = (await params)
  const { consentAction, grantScope, remember, identity } = await request.json()
  const session = extractSession(identity, grantScope)

  const consentRequest = await getConsentRequest(consentChallenge)
  const consentBody = await consentRequest.json()
  const grant_access_token_audience = consentBody.request_access_token_audience
  console.log(session)

  if (!consentChallenge || !consentAction) {
    return NextResponse.json({error: 'Missing required parameters'}, {status: 401})
  }

  if (consentAction == "accept") {
    let url = new URL(`${baseURL}/admin/oauth2/auth/requests/consent/accept`)
    url.search = new URLSearchParams([['consent_challenge', consentChallenge]]).toString()
    const acceptResponse = await fetch(url, {
        headers: { 
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_scope: session.access_token.scope,
        grant_access_token_audience: grant_access_token_audience,
        session,
        remember: Boolean(remember),
        remember_for: 3600
      })
    })
    console.log(acceptResponse)
    const acceptBody = await acceptResponse.json()
    console.log(acceptBody)
    return
  }
}
