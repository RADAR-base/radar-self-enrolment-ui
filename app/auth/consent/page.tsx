"use client";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { withBasePath } from "@/app/_lib/util/links";
import { RadarCard } from "@/app/_ui/components/base/card";

function userIsParticipant(userSession: any): boolean {
  return userSession?.identity?.schema_id == "subject"
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

function getConsentRequest(consentChallenge: string,
                           setConsent: (value: any) => void,
                           setScopes: (value: string[]) => void) {
  fetch(withBasePath('/api/ory/consent?consent_challenge=' + consentChallenge)).then(
    (response) => {
      if (response.ok) {
        response.json().then((data => {
          setConsent(data)
          setScopes(data['requested_scope'])
        }))
      } else {
        setConsent(null)
      }
    }
  )
}

function ConsentForm(props: {accept: (scopes: string[]) => void, reject: () => void, userSession: any, scopes: string[]}) {
  return   <Stack padding={2}>
              {props.userSession && props.userSession['identity']['traits']['email']}
              <Typography variant='subtitle1'>Requested Scopes</Typography>
              {props.scopes && props.scopes.map((s, i) => <Typography key={i}>{s}</Typography>)}
              <Box display='flex' flexDirection={'row'} justifyContent={'space-between'}>
                <Button onClick={() => props.reject()}>Reject</Button>
                <Button onClick={() => props.accept(props.scopes)}>Accept</Button>
              </Box>
            </Stack>
}

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [userSession, setUserSession] = useState<any>(undefined)
  const [consent, setConsent] = useState<any>(undefined)
  const [scopes, setScopes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [accepted, setAccepted] = useState<boolean>(false)

  const consentChallenge = searchParams.get('consent_challenge') ?? ""

  async function acceptSkipConsent() {
  }

  function accept() {
    const body = {
      consentAction: 'accept',
      grantScope: scopes,
      remember: 'true',
    }
    if (accepted) { return }
    setAccepted(true)
    fetch(withBasePath('/api/consent?' + new URLSearchParams({
      consent_challenge: consentChallenge
    })), {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(
      (r) => {
        if (r.ok) {
          r.json().then(
            (d) => {
              window.location.replace(d.redirect_to)
            }
          )
        } else {
          console.log(r)
          setAccepted(false)
        }
      }
    )
  }


  function reject() {
    const body = {
      consentAction: 'reject',
      grantScope: scopes,
      remember: 'true',
    }
    fetch(withBasePath('/api/consent?' + new URLSearchParams({
      consent_challenge: consentChallenge
    })), {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(
      (r) => {
        if (r.ok) {
          r.json().then(
            (d) => {
              console.log(d)
              window.location.replace(d.redirect_to)
            }
          )
        } else {
          console.log(r)
          setAccepted(false)
        }
      }
    )
  }

  useEffect(() => {
    if (consentChallenge == "") {
      router.replace('/')
      return
    }
    if (userSession == undefined) {
      getUserSession(setUserSession)
    }
    if (consent == undefined) {
      getConsentRequest(consentChallenge, setConsent, setScopes)
    }
    if (consent == null) {
      // Set error content
    }
    if ((scopes.length > 0) && (userSession != undefined)) {
      if (userIsParticipant(userSession)) {
        accept()
      } else {
        setIsLoading(false)
      }
    }
  }, [consent, userSession])

  // if ((!!consent?.client?.skip_consent) && (!!userSession)) {
  //   accept()
  // }

  return isLoading ? 
              <div></div>
            : <RadarCard><ConsentForm accept={accept} reject={reject} userSession={userSession} scopes={scopes} /></RadarCard>
}