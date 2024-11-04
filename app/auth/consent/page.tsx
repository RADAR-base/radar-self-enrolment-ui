"use client";
import { Card } from "@mui/material";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { hydra } from "@/app/_lib/auth/ory/ory";
import * as ory from "@/app/_lib/auth/ory/api.client"
import { OAuth2ApiGetOAuth2ClientRequest, OAuth2ConsentRequest } from "@ory/client";
import { OrySession } from "@/app/_lib/auth/ory/types";


async function acceptSkipConsent(consent: OAuth2ConsentRequest, userSession: OrySession) {
  const router = useRouter()
  var url = new URL("admin/oauth2/auth/requests/consent/accept", "http://localhost:4455/")
  var params = new URLSearchParams([["consent_challenege", consent.challenge]])
  url.search = params.toString();

  let r = await hydra.acceptOAuth2ConsentRequest({consentChallenge: consent.challenge})
  if (r.status == 200) {
    router.push(r.data.redirect_to)
  }

  // let body = {
  //   context: {test: "hi"},
  //   grant_scope: consent.requested_scope,
  //   remember: true,
  //   remember_for: 3600,
  //   session: {
  //     access_token: userSession.identity
  //   }
  // }
  // return await fetch(url, {
  //   method: 'PUT',
  //   headers: {
  //     'accept': 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   credentials: 'include',
  //   body: JSON.stringify(body)
  // })
}

function getUserSession(setSession: (value: any) => void) {
  ory.whoAmI().then(
    (value) => {
      if (value.ok) {
        value.json().then(
          (session) => setSession(session)
        )
      }
    }
  )
}

function getConsentRequest(consentChallenge: string, setConsent: (value: any) => void) {
  hydra.getOAuth2ConsentRequest({
    consentChallenge: consentChallenge
  }).then(
    (value) => {
      console.log(value)
      setConsent(value.data)
    }
  )
}

export default function Page() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [userSession, setUserSession] = useState<any>(undefined)
  const [consent, setConsent] = useState<OAuth2ConsentRequest | null | undefined>(undefined)

  const consentChallenge = searchParams.get('consent_challenge') ?? ""

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
    }
  }, [consent])


  console.log('skip')
  console.log(consent)
  console.log(userSession)

  if ((!!consent?.client?.skip_consent) && (!!userSession)) {
    acceptSkipConsent(consent, userSession)
  }
  return <Card>{userSession?JSON.stringify(userSession, null, 2):""}</Card>
}