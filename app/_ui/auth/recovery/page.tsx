"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { IOryRecoveryFlow, IOryErrorFlow } from "@/app/_lib/auth/ory/flows.interface"
import { CircularProgress, Box, Typography } from "@mui/material"
import { ParticipantContext } from "@/app/_lib/auth/provider.client"
import { withBasePath } from "@/app/_lib/util/links"
import { RadarCard } from "@/app/_ui/components/base/card"
import { EnterEmailRecoveryComponent } from "./enterEmailForm"
import { RecoveryCodeComponent } from "./enterCodeForm"
import { ErrorComponent } from "./errorComponent"
import { errorTextFromFlow, FlowErrors } from "../common/displayErrors"
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client"
import { SuccessComponent } from "./successComponent"

interface RecoveryPageComponentProps {
  flow?: IOryRecoveryFlow
}

export function RecoveryPageComponent(props: RecoveryPageComponentProps): React.ReactElement<any> {
  const [flow, setFlow] = useState<IOryRecoveryFlow | IOryErrorFlow | undefined>(props.flow)
  const [errors, setErrors] = useState<FlowErrors>()
  const [content, setContent] = useState<React.ReactElement<any>>(<CircularProgress style={{alignSelf: 'center'}}/>)
  const userSession = useContext(ParticipantContext)
  const study = useContext(ProtocolContext)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const flowId = searchParams.get('flow')

  useEffect(() => {
    if (userSession?.loggedIn) {
      router.replace('./')
    }
    if (flow == undefined) {
      if (flowId == null) {
        const redirUri = withBasePath(study.studyId ? 
                                      `/${study.studyId}/account/settings` :
                                      `/account/settings`)
        fetch(withBasePath(`/api/ory/recovery/browser?return_to=${redirUri}`)).then(
          (response) => {
            try {
              response.json().then(
                (data: IOryRecoveryFlow | IOryErrorFlow) => {
                  setFlow(data)
                }
              )
            } catch {
              console.log("Error retrieving flow")
            }
          }
        )
      } else {
        fetch(withBasePath(`/api/ory/recovery/flows?flow=${flowId}`)).then(
          (response) => {
            try {
              response.json().then(
                (data: IOryRecoveryFlow | IOryErrorFlow) => {
                  setFlow(data)
                }
              )
            } catch {
              console.log("Error retrieving flow")
            }
          }
        )
      }
    } else {
      const newParams = new URLSearchParams(searchParams.toString())
      if ('id' in flow) {
        newParams.set('flow', flow.id)
        router.replace(`${pathname}?${newParams.toString()}`)
      }
      if ("state" in flow) {
        setErrors(errorTextFromFlow(flow))
        switch (flow.state) {
          case 'choose_method':
            setContent(<EnterEmailRecoveryComponent flow={flow} setFlow={setFlow} />)
            break
          case 'sent_email':
            setContent(<RecoveryCodeComponent flow={flow} setFlow={setFlow} />)
            break
          case 'passed_challenge':
            setContent(<SuccessComponent />)
            router.replace('./account/settings')
            break
          default:
            setContent(<CircularProgress style={{alignSelf: 'center'}}/>)
            break
        }
      } else {
        switch (flow.error.id) {
          case 'session_already_available':
            setContent(<ErrorComponent title={"Already logged in"} message={"You are already logged in"} />)
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
            setContent(<SuccessComponent />)
            break
          default:
            setContent(<ErrorComponent title={flow.error.status} message={flow.error.reason} />)
            break
        }
      }
    }
  }, [flow, flowId])

  return (
    <RadarCard>
      <Box padding={4} display={'flex'} flexDirection={'column'} textAlign={'left'} gap={2}>
        <Typography variant='h1'>Recover Account</Typography>
        {errors?.general && <Typography variant='overline' color='error'>{errors.general}</Typography>}
        {content}
      </Box>
    </RadarCard>
  )
}