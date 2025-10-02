"use client"
import { Box, Button, CircularProgress, Container, Link, Stack, TextField, Typography } from '@mui/material';
import { RadarCard } from '@/app/_ui/components/base/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { withBasePath } from '@/app/_lib/util/links';
import { ParticipantContext } from '@/app/_lib/auth/provider.client';
import { EnterEmailRecoveryComponent } from "./enterEmailForm"
import { ErrorComponent } from "./errorComponent"
import { SuccessComponent } from "./successComponent"
import { IOryErrorFlow, IOryRecoveryFlow } from '@/app/_lib/auth/ory/flows.interface';
import SettingsComponent from "@/app/_ui/auth/settings";


interface RecoveryPageComponentProps {
  flow?: IOryRecoveryFlow
}

export function RecoveryPageComponent(props: RecoveryPageComponentProps): React.ReactElement<any> {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [flow, setFlow] = useState<IOryRecoveryFlow | IOryErrorFlow | undefined>(props.flow)
  const flowId = searchParams.get('flow')
  const token = searchParams.get('token')
  const [content, setContent] = useState<React.ReactElement<any>>(<CircularProgress style={{alignSelf: 'center'}}/>)
  const userSession = useContext(ParticipantContext)


  useEffect(() => {
    if (userSession?.loggedIn) {
      router.replace('./')
      router.refresh()
    }
    if (flow == undefined) {
      let flowPath: string
      if (flowId == null) {
        flowPath = '/api/ory/recovery/browser'
      } else {
        if (token) {
          flowPath = `/api/ory/recovery/flows?flow=${flowId}&token=${token}`
        } else {
          flowPath = `/api/ory/recovery/flows?flow=${flowId}`
        }
      }
      fetch(withBasePath(flowPath)).then(
          (response) => {
            if (response.ok) {
              response.json().then(
                  (data) => {
                    setFlow(data as IOryRecoveryFlow)
                  }
              )
            }
          }
      )
    }
  }, [flowId, token, userSession?.loggedIn])

  useEffect(() => {
    if (flow) {
      if ("state" in flow) {
        switch (flow.state) {
          case 'choose_method':
            setContent(<EnterEmailRecoveryComponent flow={flow} setFlow={setFlow} />)
            break
          case 'sent_email':
            setContent(
                <Box display={'flex'} flexDirection={'column'} gap={4}>
                  <Typography>Recovery email has been sent!</Typography>
                  <Typography>
                    If the provided address was associated with a registered user account, you will receive an email.
                    Follow the instructions in the email to recover your account.
                  </Typography>
                  <Button
                      color="primary"
                      variant="contained"
                      onClick={() => router.push('/auth/login')}
                  >
                    Continue to Login
                  </Button>
                </Box>
            )
            break
          case 'passed_challenge':
            setContent(<SettingsComponent onComplete={() => {
              setContent(
                  <Box display={'flex'} flexDirection={'column'} gap={4}>
                    <Typography>Password successfully updated!</Typography>
                    <Typography>Your account has been verified and your password has been set.</Typography>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => router.push('/auth/login')}
                    >
                      Continue to Login
                    </Button>
                  </Box>
              )
            }} />)
            break
          default:
            setContent(<CircularProgress style={{alignSelf: 'center'}}/>)
            break
        }
      } else {
          switch (flow.error.id) {
              case 'session_already_available':
                  setContent(<ErrorComponent title={"Already logged in"} message={"You are already logged in"}/>)
                  break
              case 'security_csrf_violation':
                  window.location.replace(window.location.pathname)
                  window.location.reload()
                  break
              case 'browser_location_change_required':
                  if (flow.redirect_browser_to) {
                      const searchParams = (new URL(flow.redirect_browser_to)).searchParams.toString()
                      window.location.replace(`./account/settings?${searchParams}`)
                  } else {
                      window.location.replace('./account/settings')
                  }
                  setContent(<SuccessComponent/>)
                  break
              default:
                  setContent(<ErrorComponent title={flow.error.status} message={flow.error.reason}/>)
                  break
          }
      }
    }
  }, [flow])

  return (
    <RadarCard>
      <Box padding={4} display={'flex'} flexDirection={'column'} textAlign={'left'} gap={4}>
        <Typography variant='h1'>Recover Account</Typography>
        {content}
      </Box>
    </RadarCard>
  )
}
