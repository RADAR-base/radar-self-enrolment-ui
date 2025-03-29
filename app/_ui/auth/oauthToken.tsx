"use client"
import authRequestLink from "@/app/_lib/connect/authRequest"
import { withBasePath } from "@/app/_lib/util/links"
import { Box, CircularProgress } from "@mui/material"
import { useState, useEffect } from "react"


async function getAuthUrl(
  clientId: string,
  scopes: string[],
  audience: string,
  redirectUri: string,
) {
  return authRequestLink({
    audience: audience ?? 'res_restAuthorizer',
    clientId: clientId ?? 'SEP',
    scopes: scopes,
    responseType: 'code',
    redirectUri: redirectUri ?? window.location.href,
    state: crypto.randomUUID()
  })
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
    console.error('Error retrieving login challenge')
    return null
  }

  const loginHydraRedirUrl = await acceptOauthLogin(loginChallenge)
  if (loginHydraRedirUrl == null) {
    console.error('Error accepting OAuth Login')
    return null
  }

  const consentChallenge = await getConsentChallenge(loginHydraRedirUrl)
  if (consentChallenge == null) {
    console.error('Error retrieving consent challenge')
    return null
  }

  const getCodeUrl = await acceptConsent(consentChallenge, scopes)
  if (getCodeUrl == null) {
    console.error('Error retrieving get code URL')
    return null
  }

  const code = await getCode(getCodeUrl)
  if (code == null) {
    console.error('Error retrieving code')
    return null
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

  const redirectUri = props.redirectUri ?? 'https://dev.radarbasedev.co.uk/kratos-ui/connect/sep' // window.location.href

  const codeFunc = props.codeFunc ?? ((code) => {getToken(code)})

  useEffect(() => {
    if (!loggingIn) {
      setLoggingIn(true)
      completeFullFlow(clientId, scopes, audience, redirectUri).then(
        (code) => {
          if (code) {
            codeFunc(code)
          } else {
            console.warn('A problem occured when retrieving the OAuth Token Code')
          }
        }
      )
    }
  }
  , [])

  return <Box sx={{alignSelf: 'center', margin: 'auto', pt: 16, pb: 16}}>
    <CircularProgress />
      </Box>
}