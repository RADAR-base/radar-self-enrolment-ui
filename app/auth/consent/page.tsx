"use client";
import { Box, Button, Card, CircularProgress, Divider, Fade, IconButton, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { withBasePath } from "@/app/_lib/util/links";
import { RadarCard } from "@/app/_ui/components/base/card";
import Checkbox from '@mui/material/Checkbox';


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

interface ConsentFormProps {
  accept: (grantScopes?: string[]) => void
  reject: () => void
  scopes: string[]
}

function ConsentForm(props: ConsentFormProps) {
  const [grantedScopes, setGrantedScopes] = useState<{[key: string]: boolean}>(() => setAllScopes(false))

  function setAllScopes(value: boolean) {
    return Object.fromEntries(props.scopes.map((v) => [v, value]))
  } 

  function handleChange(scope: string, checked: boolean) {
    setGrantedScopes(prev => ({
      ...prev,
      [scope]: checked
    }))
  }

  function getAcceptedScopes() {
    return Object.keys(grantedScopes).filter(scope => grantedScopes[scope])
  }

  return  <Stack padding={2} gap={1}>
            <Box display='flex' flexDirection={'row'} justifyContent={'space-between'}>
            <Typography variant='subtitle1'>Requested Scopes</Typography>
              <Button onClick={() => setGrantedScopes(setAllScopes(true))}>Select All</Button>
            </Box>
            <Box>
              {props.scopes && props.scopes.map((s, i) => {
                const checked = grantedScopes[s] ?? false
                return (
                  <ListItem
                    key={i}
                    secondaryAction={
                      <Checkbox checked={checked} onChange={(ev, checked) => {handleChange(s, checked)}} />
                    }
                  >
                    <ListItemText primary={s} />
                  </ListItem>)
              }
              )}
            </Box>
            <Divider />
            <Box display='flex' flexDirection={'row'} justifyContent={'space-between'}>
              <Button onClick={() => props.reject()}>Reject</Button>
              <Button onClick={() => props.accept(getAcceptedScopes())}>Accept</Button>
            </Box>
          </Stack>
}


export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [userSession, setUserSession] = useState<any>(undefined)
  const [consent, setConsent] = useState<any>(undefined)
  const [scopes, setScopes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [accepted, setAccepted] = useState<boolean>(false)

  const consentChallenge = searchParams.get('consent_challenge') ?? ""

  function accept(grantScopes?: string[]) {
    const body = {
      consentAction: 'accept',
      grantScope: grantScopes ?? scopes,
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
              window.location.replace(d.redirect_to)
            }
          )
        } else {
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
    if ((!!(consent?.client?.skip_consent)) && (!!userSession)) {
      accept()
    }
    if ((scopes.length > 0) && (!!userSession)) {
      if (userIsParticipant(userSession) && 
        (consent?.client?.client_id == 'SEP') || 
        (consent?.client?.client_id == 'aRMT')) {
        accept()
      } else {
        setIsLoading(false)
      }
    }
  }, [consent, userSession])

  return (
    <Box marginTop={{xs: 0, sm: 2}} marginBottom={{xs: 0, sm: 2}} maxWidth={800} justifySelf={'center'} width='100%'>
      <RadarCard> 
        <Fade
          in={isLoading}
          style={{
            transitionDelay: isLoading ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <CircularProgress />
        </Fade>
        {(consent != null) && <ConsentForm accept={accept} reject={reject} scopes={scopes} /> }
      </RadarCard>
    </Box>
  )
}