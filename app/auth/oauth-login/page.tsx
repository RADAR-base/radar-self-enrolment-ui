"use client"
import Login from '@/app/_ui/auth/login';
import { Box, Button, Card, Stack, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { kratos, hydra } from '@/app/_lib/auth/ory/ory';
import { useFormik } from "formik"
import { getCsrfToken } from '@/app/_lib/auth/ory/util';
import { useState, useEffect, useCallback } from 'react';
import { LoginFlow, UpdateLoginFlowBody, UpdateLoginFlowWithPasswordMethod } from '@ory/client';

import * as ory from '@/app/_lib/auth/ory/api.client'


interface LoginFormProps {
  flow?: LoginFlow
}

function LoginForm({flow: flow}: LoginFormProps) {
  const router = useRouter()    
  const formik = useFormik({
    initialValues: {
        email: '',
        password: '',
    },
    onSubmit: async (values: {email: string, password: string}) => 
    {
      const body = {
        method: "password",
        identifier: values.email,
        password: values.password,
        csrf_token: getCsrfToken(flow),      
      } 
      if (flow == undefined) { return }
      let resp = await ory.submitLoginFlow(flow.id, body)
      if (resp.status == 422) {
        let {redirect_browser_to: url} = await resp.json()
        router.push(url)
      } else {
        console.log('Other error')
      }
    }
  });
  return (      
    <Box 
      display="flex"
      alignItems="center"
      alignContent="center"
      p={4}>
      <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2} alignItems="center">
          <h1>Login</h1>
          <TextField
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.errors.email}
              
              />
          <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}/>
          <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting}>
              Login
          </Button>
          </Stack>
      </form>
    </Box>)
}

function LoginWithCurrentAccountButton() {

}


export default function Page() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const loginChallenge = searchParams.get('login_challenge') ?? undefined

  let [flow, setFlow] = useState<LoginFlow>();  

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
  
      return params.toString()
    },
    [searchParams]
  )

  useEffect(() => {
    let flowId = searchParams.get('flowId')
    if (flow == undefined) {
      if (flowId != null) {
        ory.getLoginFlow(flowId).then(
          (response) => {
            if (response.ok) {
              response.json().then(
                (data) => {
                  router.push(pathname + '?' + createQueryString('flowId', data.id ))
                  setFlow(data)
                }
              )
            } else {
              ory.createLoginFlow({'login_challenge': loginChallenge}).then(
                (value) => value.json().then(
                  (data) => {
                    router.push(pathname + '?' + createQueryString('flowId', data.id ))
                    setFlow(data)
                  }
                )
              )
            }
        })
      } else {
        ory.createLoginFlow({'login_challenge': loginChallenge}).then(
          (value) => {
            console.log(value)
            value.json().then(
            (data) => {
              router.push(pathname + '?' + createQueryString('flowId', data.id ))
              setFlow(data)
            }
          )
      })
      }
    }
  }, [flow])

  return <Card>
    <LoginForm flow={flow} />
  </Card>
}
