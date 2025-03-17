"use client"
import { Box, Button, CircularProgress, Container, Link, Stack, TextField, Typography } from '@mui/material';
import { RadarCard } from '@/app/_ui/components/base/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { withBasePath } from '@/app/_lib/util/links';
import { getCsrfToken } from '@/app/_lib/auth/ory/util';
import { useFormik } from 'formik';
import Yup from '@/app/_lib/armt/validation/yup'

interface EnterEmailRecoveryComponentProps {
  flow?: IOryRecoveryFlow
  setFlow: (flow: IOryRecoveryFlow) => void
  email?: string
  setEmail: (email: string) => void
}

function EnterEmailRecoveryComponent(props: EnterEmailRecoveryComponentProps) {
  let [errorText, setErrorText] = useState<string>('');
  const router = useRouter()

  const submit = async (email: string): Promise<void> => {
    const body = {
      email: email,
      csrf_token: getCsrfToken(props.flow),
      method: 'code'
    }
    if (props.flow) {
      const res = await fetch(withBasePath('/api/ory/recovery?' + new URLSearchParams({
        flow: props.flow.id
      })), {
        method: 'POST',
        body: JSON.stringify(body)
      })

      if (res.ok) {
        const newFlow = (await res.json()) as IOryRecoveryFlow
        displayErrors(newFlow)
        props.setEmail(formik.values.email)
        props.setFlow(newFlow)
      }
  }
}

  const displayErrors = (flow: IOryRecoveryFlow) => {
    if (flow) {
      if (flow.ui.messages.length > 0) {
        setErrorText(flow.ui.messages[0].text)
      }
      flow.ui.nodes.filter(node => node.messages.length > 0).forEach(
        (node) => {setErrorText(node.messages[0].text)}
      )
    }
  }

  const formik = useFormik({
      initialValues: {
          email: props.email ?? '',
      },
      validationSchema: Yup.object({email: Yup.string().email("Please enter a valid email").required()}),
      onSubmit: async (values: any) => {
        const resp = await submit(values.email)
      }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={4} alignItems="flex-start">
        {errorText && <Typography variant='overline' color='error'>{errorText}</Typography>}
        <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={<Typography variant="overline" component={'span'} color="error">{formik.errors.email?.toString()}</Typography>}
            error={(formik.errors.email != undefined)}
            />
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width={'100%'}>
            <Button color="primary" variant="contained" onClick={() => router.back()}>
                Back
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting || (props.flow==undefined)}>
                Submit
            </Button>
          </Box>
        </Stack>
    </form>
  )
}

interface EmailSentComponentProps {
  flow: IOryRecoveryFlow
  setFlow: (flow: IOryRecoveryFlow) => void
}

function EmailSentComponent(props: EmailSentComponentProps) {
  const [errorText, setErrorText] = useState<string>()
  async function submit(code: string) {
    const body = {
      code: code,
      csrf_token: getCsrfToken(props.flow),
      method: 'code'
    }
    if (props.flow) {
      const res = await fetch(withBasePath('/api/ory/recovery?' + new URLSearchParams({
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
      <Typography>An email has been sent containing a recovery code. Please enter it in the box below</Typography>
      {errorText && <Typography variant='overline' color='error'>{errorText}</Typography>}
      <TextField
              fullWidth
              id="code"
              name="code"
              label="Recovery Code"
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

interface RecoveryComponentProps {
  flow?: IOryRecoveryFlow
}

export function RecoveryComponent(props: RecoveryComponentProps): React.ReactElement {
  const searchParams = useSearchParams()
  const [flow, setFlow] = useState<IOryRecoveryFlow | undefined>(props.flow)
  const [email, setEmail] = useState<string>()
  const [content, setContent] = useState<React.ReactElement>(<EnterEmailRecoveryComponent flow={flow} setFlow={setFlow} email={email} setEmail={setEmail} />)
  const flowId = searchParams.get('flow')

  useEffect(() => {
    if (flow == undefined) {
      if (flowId == null) {
        fetch(withBasePath('/api/ory/recovery/browser')).then(
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
      } else {
        fetch(withBasePath(`/api/ory/recovery/flows?flow=${flowId}`)).then(
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
    }

  if (flow) {
    switch (flow.state) {
      case 'choose_method':
        setContent(<EnterEmailRecoveryComponent flow={flow} setFlow={setFlow} email={email} setEmail={setEmail} />)
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
        <Typography variant='h1'>Recover Account</Typography>
        {content}
      </Box>
    </RadarCard>
  )
}