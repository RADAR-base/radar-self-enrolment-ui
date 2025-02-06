"use client"
import { Box, Button, CircularProgress, Container, Link, Stack, TextField, Typography } from '@mui/material';
import { RadarCard } from '@/app/_ui/components/base/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { withBasePath } from '@/app/_lib/util/links';
import { getCsrfToken } from '@/app/_lib/auth/ory/util';
import { useFormik } from 'formik';
import Yup from '@/app/_lib/armt/validation/yup'

interface EmailSentComponentProps {
  flow: IOryVerificationFlow
  setFlow: (flow: IOryVerificationFlow) => void
}

function EmailSentComponent(props: EmailSentComponentProps) {
  const [errorText, setErrorText] = useState<string>()
  console.log(props.flow)
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
      } else {
        const data = await res.json()
        props.setFlow(data)
      }
  }
  }
  
  const formik = useFormik({
    initialValues: {code: ''},
    validationSchema: Yup.object({code: Yup.string().matches(/^[0-9]+$/, 'Must be numeric').required('Required')}),
    onSubmit: (values: any) => {submit(values.code)}
  });

  return (
    <form onSubmit={formik.handleSubmit}>
    <Box display={'flex'} flexDirection={'column'} gap={4}>
      <Typography>An email has been sent containing a verification code. Please enter it in the box below</Typography>
      {errorText && <Typography variant='overline' color='error'>{errorText}</Typography>}
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
              />
      <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width={'100%'}>
        <Button color="primary" variant="contained" onClick={() => {}}>
          Back
        </Button>
        <Button color="primary" variant="contained" onClick={() => {}}>
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

interface VerificationComponentProps {
  flow?: IOryVerificationFlow
}

export function VerificationComponent(props: VerificationComponentProps): React.ReactElement {
  const [flow, setFlow] = useState<IOryVerificationFlow | undefined>(props.flow)
  const [content, setContent] = useState<React.ReactElement>()

  const searchParams = useSearchParams()
  const flowId = searchParams.get('flow')

  useEffect(() => {
    if (flow == undefined) {
      if (flowId == null) {
        fetch(withBasePath('/api/ory/verification/browser')).then(
          (response) => {
            if (response.ok) {
              response.json().then(
                (data) => {
                  setFlow(data as IOryVerificationFlow)
                }
              )
            }
          }
        )
      } else {
        fetch(withBasePath(`/api/ory/verification/flows?flow=${flowId}`)).then(
          (response) => {
            if (response.ok) {
              response.json().then(
                (data) => {
                  setFlow(data as IOryVerificationFlow)
                }
              )
            }
          }
        )
      }
    }

  if (flow) {
    switch (flow.state) {
      case 'choose_method':
        setContent(<CircularProgress />)
        break
      case 'sent_email':
        setContent(<EmailSentComponent flow={flow} setFlow={setFlow} />)
        break
      default:
        setContent(<CircularProgress style={{alignSelf: 'center'}}/>)
        break
    }
  }
  }, [flow, flowId])

  return (
    <RadarCard>
      <Box padding={4} display={'flex'} flexDirection={'column'} textAlign={'left'} gap={4}>
        <Typography variant='h1'>Verify Account</Typography>
        {content}
      </Box>
    </RadarCard>
  )
}