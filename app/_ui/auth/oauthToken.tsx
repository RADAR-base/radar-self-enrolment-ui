"use client"
import { withBasePath } from "@/app/_lib/util/links"
import { Box, CircularProgress } from "@mui/material"
import { useState, useEffect } from "react"
import pRetry from 'p-retry';

async function getAuthUrl(
  clientId: string,
  scopes: string[],
  audience: string,
  redirectUri: string
): Promise<string> {
  const state = crypto.randomUUID()

  const params = new URLSearchParams({
    clientId: clientId ?? 'SEP',
    responseType: 'code',
    audience: audience ?? 'res_restAuthorizer',
    redirectUri: redirectUri ?? window.location.href,
    state,
  })

  if (scopes?.length) {
    params.append('scopes', scopes.join(','))
  }

  const res = await fetch(withBasePath(`/api/auth/request?${params.toString()}`))

  if (!res.ok) {
    throw new Error('Failed to get auth URL')
  }

  const data = await res.json()
  return data.authUrl
}

async function getLoginChallenge(
  authUrl: string
): Promise<string | null> {
  const resp = await fetch(authUrl)
  return (new URL(resp.url)).searchParams.get("login_challenge")
}

async function acceptOauthLogin(
  loginChallenge: string
): Promise<string | null> {
  /* 
    Accepts OAuth Login request

    Returns redirect URL to Hydra consent flow 
  */
  const resp = await fetch(withBasePath('/api/oauth-login?login_challenge=' + loginChallenge),
    {
      method: 'POST',
      body: JSON.stringify({remember: true})
    }
  )
  const data = await resp.json()
  return data['redirect_to'] ?? null
}

async function getConsentChallenge(
  loginHydraRedirUrl: string
): Promise<string | null> {
const resp = await fetch(loginHydraRedirUrl)
const consentChallenge = (new URL(resp.url)).searchParams.get('consent_challenge')
return consentChallenge
}

async function acceptConsent(
  consentChallenge: string,
  grantScopes: string[]
): Promise<string | null> {
  /*
    Accepts OAuth Consent

    Returns redirect URL to complete OAuth flow / get code
  */

  const acceptConsentBody = {
    consentAction: 'accept',
    grantScope: grantScopes,
    remember: 'true'
  }

  const resp = await fetch(withBasePath('/api/consent?') + new URLSearchParams({
    consent_challenge: consentChallenge
  }), {
    method: 'POST',
    body: JSON.stringify(acceptConsentBody)
  })
  const data = await resp.json()
  return data['redirect_to'] ?? null
}


async function getCode(
  getCodeUrl: string
) {
  const resp = await fetch(getCodeUrl)
  const code = (new URL(resp.url)).searchParams.get('code')
  return code
}

async function getToken(
  code: string,
) {
  const resp = await fetch(withBasePath('/api/connect/sep/token?code=' + code))
  window.location.reload()
  return
}



async function completeFullFlow(
  clientId: string,
  scopes: string[],
  audience: string,
  redirectUri: string
) {

  const authUrl = await getAuthUrl(clientId, scopes, audience, redirectUri)
  
  const loginChallenge = await getLoginChallenge(authUrl)
  if (loginChallenge == null) {
    throw new Error('Error retrieving login challenge')
  }

  const loginHydraRedirUrl = await acceptOauthLogin(loginChallenge)
  if (loginHydraRedirUrl == null) {
    throw new Error('Error accepting OAuth Login')
  }

  const consentChallenge = await getConsentChallenge(loginHydraRedirUrl)
  if (consentChallenge == null) {
    throw new Error('Error retrieving consent challenge')
  }

  const getCodeUrl = await acceptConsent(consentChallenge, scopes)
  if (getCodeUrl == null) {
    throw new Error('Error retrieving get code URL')
  }

  const code = await getCode(getCodeUrl)
  if (code == null) {
    throw new Error('Error retrieving code')
  }
  return code
}

interface OauthTokenProps {
  scopes?: string[]
  clientId?: string
  audience?: string
  redirectUri?: string
  codeFunc?: (code: string) => void, 
}

export function GetOauthToken(props: OauthTokenProps): React.ReactNode {

  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const scopes = (
    props.scopes ?? 
    [
      "SOURCETYPE.READ",
      "PROJECT.READ",
      "SUBJECT.READ",
      "SUBJECT.UPDATE",
      "SUBJECT.CREATE"
    ]
  )

  const clientId = props.clientId ?? 'SEP'

  const audience = props.audience ?? 'res_restAuthorizer'

  const redirectUri = props.redirectUri ?? window.location.href

  const codeFunc = props.codeFunc ?? ((code) => {getToken(code)})

  useEffect(() => {
    if (!loggingIn) {
      setLoggingIn(true)
      pRetry(() => completeFullFlow(clientId, scopes, audience, redirectUri), {
        retries: 12,
        maxRetryTime: 30000
      })
        .then((code) => {
            if (code) { codeFunc(code) } 
            else { console.warn('A problem occured when retrieving the OAuth Token Code')}
          }
        )
    }
  }
  , [])

  return <Box sx={{alignSelf: 'center', margin: 'auto', pt: 16, pb: 16}}>
    <CircularProgress />
  </Box>
}