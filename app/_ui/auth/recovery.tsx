"use client"
import { Box, Button, CircularProgress, Container, Link, Stack, TextField, Typography } from '@mui/material';
import { RadarCard } from '@/app/_ui/components/base/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { withBasePath } from '@/app/_lib/util/links';
import { getCsrfToken } from '@/app/_lib/auth/ory/util';
import { useFormik } from 'formik';

function EnterEmailRecoveryComponent(props: {flow?: IOryRecoveryFlow, setFlow: (flow: IOryRecoveryFlow) => void}) {
  let [errorText, setErrorText] = useState<string>('');
  const router = useRouter()

  const submit = async (email: string): Promise<void> => {
    const body = {
      email: email,
      csrf_token: getCsrfToken(props.flow),
      method: 'link'
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
        (node) => {
          if ((node.attributes.name) in formik.errors) {
            formik.errors[node.attributes.name] = node.messages[0].text
          }
        }
      )
    }
  }

  const formik = useFormik({
      initialValues: {
          email: '',
      },
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
            error={formik.touched.email && Boolean(formik.errors.email)}
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

function LinkSentComponent() {

  return <Box>
    <Typography>An email has been sent</Typography>
  </Box>
}

interface RecoveryComponentProps {
  flow?: IOryRecoveryFlow
}

export function RecoveryComponent(props: RecoveryComponentProps): React.ReactElement {
  const searchParams = useSearchParams()
  const [flow, setFlow] = useState<IOryRecoveryFlow | undefined>(props.flow)
  const [content, setContent] = useState<React.ReactElement>(<EnterEmailRecoveryComponent flow={flow} setFlow={setFlow} />) // <CircularProgress style={{alignSelf: 'centers'}} />)
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
        setContent(<EnterEmailRecoveryComponent flow={flow} setFlow={setFlow} />)
        break
      case 'sent_email':
        setContent(<LinkSentComponent />)
        break
      default:
        setContent(<CircularProgress style={{alignSelf: 'centers'}}/>)
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