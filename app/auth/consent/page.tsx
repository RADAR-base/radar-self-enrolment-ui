"use client";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { OrySession } from "@/app/_lib/auth/ory/types";
import { withBasePath } from "@/app/_lib/util/links";
import { acceptConsentRequest } from "@/app/_lib/auth/ory/hydra";


import { Configuration, OAuth2Api, FrontendApi, IdentityApi } from "@ory/client"

 const hydra = new OAuth2Api(
  new Configuration({
    basePath: 'http://localhost:4445',
  })
)


async function acceptSkipConsent(consent: {challenge: string}, userSession: OrySession) {
  const router = useRouter()
  // let r = await hydra.acceptOAuth2ConsentRequest({consentChallenge: consent.challenge})
  // if (r.status == 200) {
  //   router.push(r.data.redirect_to)
  // }
}

function getUserSession(setSession: (value: any) => void) {
  fetch(withBasePath('/api/ory/whoAmI'), {cache: 'no-store'}).then(
    (response) => {
      if (response.status == 200) {
        response.json().then(
          (data) => setSession(data)
        )
      }
    }
  )
}

function getConsentRequest(consentChallenge: string, setConsent: (value: any) => void) {
  fetch(withBasePath('/api/ory/consent?consent_challenge=' + consentChallenge)).then(
    (response) => {
      if (response.ok) {
        response.json().then((data => setConsent(data)))
      }
    }
  )
}



export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [userSession, setUserSession] = useState<any>(undefined)
  const [consent, setConsent] = useState<any>(undefined)
  const [scopes, setScopes] = useState<string[]>([])

  const consentChallenge = searchParams.get('consent_challenge') ?? ""

  function accept() {
    const body = {
      consentAction: 'accept',
      grantScope: scopes,
      remember: 'true',
      identity: userSession.identity
    }
    fetch(withBasePath('/api/consent?' + new URLSearchParams({
      consent_challenge: consentChallenge
    })), {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(
      (r) => {
        r.json().then(
          (d) => {
            router.push(d.redirect_to)
          }
        )
      }
    )
  }
  useEffect(() => {
    if (consentChallenge == "") {
      router.push('/')
      return
    }
    if (userSession == undefined) {
      getUserSession(setUserSession)
    }
    if (consent == undefined) {
      getConsentRequest(consentChallenge, setConsent)
    } else {
      setScopes(consent['requested_scope'])
    }
  }, [consent])

  if ((!!consent?.client?.skip_consent) && (!!userSession)) {
    acceptSkipConsent(consent, userSession)
  }
  return (
    <Card>
      <Stack padding={2}>
        {userSession && userSession['identity']['traits']['email']}
        <Typography variant='subtitle1'>Requested Scopes</Typography>
        {scopes.map((s, i) => <Typography key={i}>{s}</Typography>)}
        <Box display='flex' flexDirection={'row'} justifyContent={'space-between'}>
          <Button>Reject</Button>
          <Button onClick={accept}>Accept</Button>
        </Box>
      </Stack>
    </Card>
  )
}