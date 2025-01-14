"use client";
import { Box, Button, Card, CircularProgress, Stack, Typography } from "@mui/material";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { OrySession } from "@/app/_lib/auth/ory/types";
import { withBasePath } from "@/app/_lib/util/links";
import { acceptConsentRequest } from "@/app/_lib/auth/ory/hydra";

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
      }
    }
  )
}

function ConsentForm(props: {accept: (scopes: string[]) => void, userSession: any, scopes: string[]}) {
  return   <Stack padding={2}>
              {props.userSession && props.userSession['identity']['traits']['email']}
              <Typography variant='subtitle1'>Requested Scopes</Typography>
              {props.scopes && props.scopes.map((s, i) => <Typography key={i}>{s}</Typography>)}
              <Box display='flex' flexDirection={'row'} justifyContent={'space-between'}>
                <Button>Reject</Button>
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
              router.push(d.redirect_to)
            }
          )
        } else {
          console.log(r)
        }
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
      getConsentRequest(consentChallenge, setConsent, setScopes)
    }
    if ((scopes.length > 0) && (userSession != undefined)) {
      if (userIsParticipant(userSession)) {
        accept()
      } else {
        setIsLoading(false)
      }
    }
  }, [consent])

  if ((!!consent?.client?.skip_consent) && (!!userSession)) {
    accept()
  }
  return (
    <Card>
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} minWidth={300} minHeight={350}>
      {isLoading ? <CircularProgress  sx={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} /> 
                 : <ConsentForm accept={accept} userSession={userSession} scopes={scopes} />
      }
      </Box>
    </Card>
  )
}