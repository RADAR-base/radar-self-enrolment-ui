"use client"
import { Box, Button, Card, Stack, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useFormik } from "formik"
import { useState, useEffect, useCallback } from 'react';
import { withBasePath } from '@/app/_lib/util/links';
import { getCsrfToken } from "@/app/_lib/auth/ory/util";

interface LoginFormProps {
  flow?: any
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
        email: values.email,
        password: values.password,
        csrf_token: getCsrfToken(flow),      
      } 
      if (flow == undefined) { return }
      // let resp = await ory.submitLoginFlow(flow.id, body)
      let resp = await fetch(withBasePath('/api/ory/login?flow=' + flow.id), 
        {method: 'POST', body: JSON.stringify(body)})
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

function getUserSession(setSession: (value: any) => void) {
  fetch(withBasePath('/api/ory/whoAmI'), {cache: 'no-store'}).then(
    (response) => {
      if (response.status == 200) {
        response.json().then(
          (data) => setSession(data)
        )
      }
    }
  )
}

function createLoginFlow(loginChallenge: string, setFlow: (value: any) => void) {
  fetch(
    withBasePath('/api/ory/login/browser?login_challenge=' + loginChallenge),
    {cache: 'no-store'}
  ).then((response) => {
      if (response.status == 200) {
        response.json().then(
          (data) => {
            setFlow(data)
          }
        )
      }
    }
  )
}

export default function Page() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [userSession, setUserSession] = useState<any>(undefined)
  const [flow, setFlow] = useState<any>();  
  const [content, setContent] = useState<JSX.Element>(<div>hi</div>)

  const loginChallenge = searchParams.get('login_challenge') ?? undefined
  if (loginChallenge == undefined) {
    router.push('/auth/login')
  }

  let flowId = searchParams.get('flowId')

  useEffect(() => {
    if (userSession === undefined) {
      getUserSession(setUserSession)
    }
      if (flow == undefined) {
        createLoginFlow(loginChallenge ?? '', setFlow)
    } else {
      setContent(<LoginForm flow={flow}></LoginForm>)
    }
  }, [flow, userSession])
  return <Card>{content}</Card>
}
