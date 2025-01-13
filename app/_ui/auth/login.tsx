"use client"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { useFormik } from "formik"
import { withBasePath } from "@/app/_lib/util/links"
import { getCsrfToken } from '@/app/_lib/auth/ory/util'
import { ParticipantContext } from '@/app/_lib/auth/provider.client'

interface LoginProps {
    onLogin?: () => void
    redirectTo?: string
    loginChallenge?: string
}

export function LoginComponent(props: LoginProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  let [flow, setFlow] = useState<any>();

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
      router.push(pathname + '?' + createQueryString('flowId', data.id ))
      setFlow(data)
    }
  }
  
  const login = async (email: string, password: string): Promise<Response> => {
    const body = {
      email: email,
      password: password,
      csrf_token: getCsrfToken(flow)
    }
    const res = await fetch(withBasePath('/api/ory/login?' + new URLSearchParams({
      flow: flow.id
    })), {
      method: 'POST',
      body: JSON.stringify(body)
    })
    return res
  }

  useEffect(() => {
    if (flow === undefined) {
      getFlow(setFlow)
    }
  }, [flow])

  const onLogin = props.onLogin ? props.onLogin : () => {
    window.location.replace(props.redirectTo ?? '/')
    // router.refresh()
  }
  const formik = useFormik({
      initialValues: {
          email: '',
          password: '',
      },
      onSubmit: async (values: any) => 
        {
        const res = await login(values.email, values.password)
        if (res.ok) {
          onLogin()
        } else {
          const data = await res.json()
        }
      }
  });
  

  return (
    <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2} alignItems="center">
        <Typography variant='h1'>Login</Typography>
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
        <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}/>
        <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting || (flow==undefined)} style={{alignSelf: 'end'}}>
            Login
        </Button>
        </Stack>
    </form>
)}

export default LoginComponent