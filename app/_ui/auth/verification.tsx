"use client"
import { Box, Button, CircularProgress, Container, Link, Stack, TextField, Typography } from '@mui/material';
import { RadarCard } from '@/app/_ui/components/base/card';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { withBasePath } from '@/app/_lib/util/links';
import { getCsrfToken } from '@/app/_lib/auth/ory/util';
import { useFormik } from 'formik';
import Yup from '@/app/_lib/armt/validation/yup'
import { ProtocolContext } from '@/app/_lib/study/protocol/provider.client';
import { IOryVerificationFlow } from '@/app/_lib/auth/ory/flows.interface';

interface EmailSentComponentProps {
  flow: IOryVerificationFlow
  setFlow: (flow: IOryVerificationFlow) => void
}

function EmailSentComponent(props: EmailSentComponentProps): React.ReactElement<any> {
  const router = useRouter()
  let errorText: string | undefined = undefined
  if (props.flow.ui.messages.length > 0) {
    let message = props.flow.ui.messages[0]
    if (message.type == 'error') {
        errorText = message.text
    }
  }

  async function submit(code: string) {
    const body = {
      code: code,
      csrf_token: getCsrfToken(props.flow),
      method: 'code'
    }
    if (props.flow) {
      const res = await fetch(withBasePath('/api/ory/verification?' + new URLSearchParams({
        flow: props.flow.id
      })), {
        method: 'POST',
        body: JSON.stringify(body)
      })
      if (res.status == 422) {
        const data = await res.json()
        const redirUri = new URL(data.redirect_browser_to)
        window.location.replace(redirUri)
      } else {
        const data = await res.json()
        props.setFlow(data)
        formik.setSubmitting(false)
      }
  }
  }

  const pathname = usePathname()
  
  const formik = useFormik({
    initialValues: {code: ''},
    validationSchema: Yup.object({code: Yup.string().matches(/^[0-9]+$/, 'Must be numeric').required('Required')}),
    onSubmit: (values: any) => {submit(values.code)}
  });

  const resendCode = () => {
    window.location.replace(withBasePath(pathname))
  }

  return (
    <form onSubmit={formik.handleSubmit}>
    <Box display={'flex'} flexDirection={'column'} gap={4}>
      {errorText && <Typography variant='overline' color='error'>{errorText}</Typography>}
      <Typography>An email has been sent to you containing a verification code. Please enter it in the box below. If you cannot find it, please look in your email’s junk/spam folder. Please note, this code expires after 60 minutes.</Typography>
      <TextField
              fullWidth
              id="code"
              name="code"
              label="Verification Code"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              slotProps={{htmlInput: {'inputMode': 'numeric'}, input: {inputMode: 'numeric'}}}
              helperText={<Typography variant="overline" component={'span'} color="error">{formik.errors.code?.toString()}</Typography>}
              error={(formik.errors.code != undefined)}
              autoComplete='one-time-code'
              />
      <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width={'100%'}>
        <Button color="primary" variant="contained" onClick={() => {router.back()}}>
          Back
        </Button>
        <Button color="primary" variant="contained" onClick={resendCode} disabled={formik.isSubmitting}>
          Resend Code
        </Button>
        <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting}>
          Submit
        </Button>
      </Box>
    </Box>
    </form>
  )
}

interface PassedChallengeComponentProps {}

function PassedChallengeComponent(props: PassedChallengeComponentProps): React.ReactElement<any> {
  return (
    <Box display={'flex'} flexDirection={'column'} gap={4}>
      <Typography>You have successfully verified your account</Typography>
      <Button href={'portal'}>Continue</Button>
    </Box>
    )
}

interface VerificationComponentProps {
  flow?: IOryVerificationFlow
}


export function VerificationComponent(props: VerificationComponentProps): React.ReactElement<any> {
  const pathname = usePathname()
  const [flow, setFlow] = useState<IOryVerificationFlow | undefined>(props.flow)
  const router = useRouter()
  const [content, setContent] = useState<React.ReactElement<any>>(<CircularProgress style={{alignSelf: 'center'}}/>)
  const studyContext = useContext(ProtocolContext)

  useEffect(() => {
    if (flow) {
      window.history.replaceState(null, '', withBasePath(pathname + '?flow=' + flow.id))
      switch (flow.state) {
        case 'choose_method':
          setContent(<CircularProgress style={{alignSelf: 'center'}}/>)
          break
        case 'sent_email':
          setContent(<EmailSentComponent flow={flow} setFlow={setFlow} />)
          break
        case 'passed_challenge':
          if (studyContext) {
            router.push(`/${studyContext.studyId}/portal`)
            router.refresh()
          } else {
            router.push('/')
            router.refresh()
          }
          setContent(<PassedChallengeComponent />)
          break
        default:
          setContent(<CircularProgress style={{alignSelf: 'center'}}/>)
          break
      }
    }
  }, [flow])

  return (
    <RadarCard>
      <Box padding={4} display={'flex'} flexDirection={'column'} textAlign={'left'} gap={4}>
        <Typography variant='h1'>Verify Account</Typography>
        {content}
      </Box>
    </RadarCard>
  )
}