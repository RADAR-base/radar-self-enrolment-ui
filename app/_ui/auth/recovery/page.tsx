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

interface RecoveryPageComponentProps {
  flow?: IOryRecoveryFlow
}

export function RecoveryPageComponent(props: RecoveryPageComponentProps): React.ReactElement<any> {
  const [flow, setFlow] = useState<IOryRecoveryFlow | IOryErrorFlow | undefined>(props.flow)
  const [email, setEmail] = useState<string>()
  const [errors, setErrors] = useState<FlowErrors>()
  const [content, setContent] = useState<React.ReactElement<any>>(<CircularProgress style={{alignSelf: 'center'}}/>)
  const userSession = useContext(ParticipantContext)
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
        fetch(withBasePath('/api/ory/recovery/browser')).then(
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
        console.log('flow id: ', flowId)
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
    }

    if (flow) {
      if ("state" in flow) {
        console.log(flow)
        setErrors(errorTextFromFlow(flow))
        switch (flow.state) {
          case 'choose_method':
            setContent(<EnterEmailRecoveryComponent flow={flow} setFlow={setFlow} email={email} />)
            break
          case 'sent_email':
            // setContent(<div>{"Email Sent Component"}</div>)
            setContent(<RecoveryCodeComponent flow={flow} setFlow={setFlow} />)
            break
          case 'passed_challenge':
            console.log('passed')
            setContent(<div>{"You have successfully used this recovery code"}</div>)
            break
          default:
            setContent(<CircularProgress style={{alignSelf: 'center'}}/>)
            break
        }
      } else {
        console.log("err")
        switch (flow.error.id) {
          case 'session_already_available':
            setContent(<ErrorComponent title={"Already logged in"} message={"You are already logged in"} />)
            break
          case 'security_csrf_violation':
            window.location.replace(window.location.pathname)
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