"use client"
import { withBasePath } from "@/app/_lib/util/links"
import { Box, CircularProgress, Link, Stack, Typography } from "@mui/material"
import { useState, useEffect, type JSX } from "react";
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
  redirectUri: string,
  codeFunc: (code: string) => Promise<void>
) {

  const authUrl = await getAuthUrl(clientId, scopes, audience, redirectUri)
  
  const loginChallenge = await pRetry(
    () => getLoginChallenge(authUrl), 
    {
      retries: 4,
      minTimeout: 1000,
      maxTimeout: 30000
    }
  )
  if (loginChallenge == null) {
    throw new Error('Error retrieving login challenge')
  }

  const loginHydraRedirUrl = await pRetry(
    () => acceptOauthLogin(loginChallenge), 
    {
      retries: 4,
      minTimeout: 1000,
      maxTimeout: 30000
    }
  )
  if (loginHydraRedirUrl == null) {
    throw new Error('Error accepting OAuth Login')
  }

  const consentChallenge = await pRetry(
    () => getConsentChallenge(loginHydraRedirUrl), 
    {
      retries: 4,
      minTimeout: 1000,
      maxTimeout: 30000
    }
  )
  if (consentChallenge == null) {
    throw new Error('Error retrieving consent challenge')
  }

  const getCodeUrl = await pRetry(
    () => acceptConsent(consentChallenge, scopes), 
    {
      retries: 4,
      minTimeout: 1000,
      maxTimeout: 30000
    }
  )
  if (getCodeUrl == null) {
    throw new Error('Error retrieving get code URL')
  }

  const code = await pRetry(
    () => getCode(getCodeUrl), 
    {
      retries: 4,
      minTimeout: 1000,
      maxTimeout: 30000
    }
  )
  if (code == null) {
    throw new Error('Error retrieving code')
  }

  await codeFunc(code)

  return
}

async function clearCookies() {
  await fetch(withBasePath('/api/ory/clearCsrf'))
  await fetch(withBasePath('/api/ory/login/browser'))
}

interface OauthTokenProps {
  scopes?: string[]
  clientId?: string
  audience?: string
  redirectUri?: string
  codeFunc?: (code: string) => Promise<void>, 
}

export function GetOauthToken(props: OauthTokenProps): React.ReactNode {

  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const [content, setContent] = useState<JSX.Element>(<CircularProgress />)
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
  
  const codeFunc = props.codeFunc ?? getToken

  useEffect(() => {
    if (!loggingIn) {
      setLoggingIn(true)
      pRetry(
        () => completeFullFlow(clientId, scopes, audience, redirectUri, codeFunc), 
        {
          retries: 8,
          minTimeout: 1000,
          maxTimeout: 30000,
          onFailedAttempt: async (attempt) => {
            if (attempt.attemptNumber > 1) {
              await clearCookies()
            }
            setContent(
              <Stack alignContent={'center'} alignItems={'center'} justifyContent={'center'} justifyItems={'center'} textAlign={'center'} gap={2}>
                <CircularProgress />
                <Typography>Authenticating with RADAR-base</Typography>
              </Stack>
            )
          }
        }
      ).catch(
        (err) => {
          setContent(<Typography m={4}>There was a problem connecting to RADAR-base. Please try again later. If the problem persists, please reach out to us at <Link href='mailto:radar-base@kcl.ac.uk'>radar-base@kcl.ac.uk</Link></Typography>)
        }
      )
    }
  }
  , [])
  return (
    <Box sx={{alignSelf: 'center', margin: 'auto', pt: 16, pb: 16}}>
      {content}
    </Box>
  )
}