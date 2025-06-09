"use client"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { useFormik } from "formik"
import { withBasePath } from "@/app/_lib/util/links"
import { getCsrfToken } from '@/app/_lib/auth/ory/util'
import { ParticipantContext } from '@/app/_lib/auth/provider.client'
import { IOryLoginFlow } from '@/app/_lib/auth/ory/flows.interface'

interface LoginProps {
    onLogin?: (response?: Response) => void
    redirectTo?: string
    loginChallenge?: string
    flow?: IOryLoginFlow
}

export function LoginComponent(props: LoginProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const participant = useContext(ParticipantContext)
  if (participant?.loggedIn) {
    router.back()
  }

  let [errorText, setErrorText] = useState<string>('');
  let [flow, setFlow] = useState<IOryLoginFlow | undefined>(props.flow);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const getFlow = async (setFlow: (v: any) => void) => {
    const response = await fetch(withBasePath('/api/ory/login/browser'))
    if (response.ok) {
      const data = await response.json()
      // router.replace(pathname + '?' + createQueryString('flowId', data.id ))
      setFlow(data)
    }
  }
  
  const login = async (email: string, password: string): Promise<Response> => {
    const body = {
      email: email,
      password: password,
      csrf_token: getCsrfToken(flow)
    }
      if (flow) {
      const res = await fetch(withBasePath('/api/ory/login?' + new URLSearchParams({
        flow: flow.id
      })), {
        method: 'POST',
        body: JSON.stringify(body)
      })
    
      return res
    } else {
      throw new Error("No flow")
    }
  }

  const displayErrors = (flow: IOryLoginFlow) => {
    if (flow) {
      if (flow.ui.messages?.length > 0) {
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

  useEffect(() => {
    if (flow === undefined) {
      getFlow(setFlow)
    }
  }, [flow])

  const onLogin = props.onLogin ? props.onLogin : () => {
    router.replace(props.redirectTo ?? '/')
    router.refresh()
  }

  const formik = useFormik({
      initialValues: {
          identifier: '',
          password: '',
      },
      onSubmit: async (values: any) => 
        {
        const res = await login(values.identifier, values.password)
        if (res.ok) {
          onLogin(res)
        } else {
          if (res.status == 422) {
            const data = await res.json()
            const url = data['redirect_browser_to']
            if (url) {router.replace(url)}
          } else {
            const data = await res.json() as IOryLoginFlow
            displayErrors(data)
            setFlow(data)
        }
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
        <Stack spacing={4} alignItems="flex-start">
        <Typography variant='h1'>Sign In</Typography>
        {errorText && <Typography variant='overline' color='error'>{errorText}</Typography>}
        <TextField
            fullWidth
            id="identifier"
            name="identifier"
            label="Email"
            value={formik.values.identifier}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.identifier && Boolean(formik.errors.identifier)}
            autoComplete='email'
          />
        <TextField
            fullWidth
            id="password"
            name="password"
            label={<Box>{"Password"}</Box>}
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            autoComplete='current-password'
            />
        <Link href={'recovery'}>Forgot password?</Link>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width={'100%'}>
          <Button color="primary" variant="contained" onClick={() => router.back()}>
              Back
          </Button>
          <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting || (flow==undefined)}>
              Login
          </Button>
        </Box>
        </Stack>
    </form>
)}

export default LoginComponent