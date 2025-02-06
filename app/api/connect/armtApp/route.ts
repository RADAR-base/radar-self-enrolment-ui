import { whoAmI } from "@/app/_lib/auth/ory/kratos"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { randomUUID } from "crypto"
import { withBasePath } from "@/app/_lib/util/links"

const HYDRA_ADMIN_URL = process.env.HYDRA_ADMIN_URL
const HYDRA_PUBLIC_URL = process.env.HYDRA_PUBLIC_URL
const CLIENT_ID = 'aRMT'
const CLIENT_SECRET = ''
const GRANT_TYPE = 'authorization_code'
const REDIRECT_URI = process.env.NEXT_PUBLIC_ARMT_REDIRECT_URI

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
  let url = new URL(`${HYDRA_ADMIN_URL}/oauth2/auth/requests/consent`)
  url.search = new URLSearchParams([['consent_challenge', consentChallenge]]).toString()
  return fetch(url)
}

function getLoginChallengeUrl(state: string) {
  if (REDIRECT_URI == undefined) {
    return ""
  }
  const scopes = [
    "SOURCETYPE.READ",
    "PROJECT.READ",
    "SUBJECT.READ",
    "SUBJECT.UPDATE",
    "MEASUREMENT.CREATE",
    "SOURCEDATA.CREATE",
    "SOURCETYPE.UPDATE",
    "offline_access"
  ]
  let u = new URL(`${HYDRA_PUBLIC_URL}/oauth2/auth`)
  u.search = new URLSearchParams([
    ['client_id', CLIENT_ID],
    ['response_type', 'code'],
    ['state', state],
    ['audience', ['res_ManagementPortal'].join('\%20')],
    ['scopes', scopes.join('%20')],
    ['redirect_uri', REDIRECT_URI]
  ]).toString()
  return u
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ consent_challenge: string }> }
) {
  const cookieString = cookies().getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')
  let oryUser: any
  let userId: string
  let identity: any
  const state = randomUUID().toString()
  try {
    const resp = await whoAmI()
    if (resp.status != 200) {
      return NextResponse.json({ error: { type: 'authentication', content: { message: "No user session" } } }, { status: 403 })
    }
    oryUser = await resp.json()
    userId = oryUser['identity']['id']
    identity = oryUser['identity']
  } catch {
    return NextResponse.json({ error: { type: 'authentication', content: { message: "Error decoding user session" } } }, { status: 403 })
  }

  const res1 = await fetch(getLoginChallengeUrl(state), {
    credentials: 'include'
  })
  const loginChallengeUrl = (new URL(res1.url))
  const loginChallenge = loginChallengeUrl.searchParams.get('login_challenge')

  const loginChallengeReq = await fetch(loginChallengeUrl, {
    credentials: 'include'
  })

  const res2 = await fetch(
    `${HYDRA_ADMIN_URL}/oauth2/auth/requests/login/accept?login_challenge=${loginChallenge}`,
    {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({
        subject: userId,
        remember: true
      }),
      headers: {
        Cookie: cookieString,
      }
    }
  )
  const loginRedirectTo = (await res2.json())['redirect_to']
  const res3 = await fetch(loginRedirectTo, {
    credentials: 'include',
    headers: {
      Cookie: cookieString,
    }
  })
  return new NextResponse(res1.url)
}