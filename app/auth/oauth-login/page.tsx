"use client"
import { Box, Button, Card, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useFormik } from "formik"
import { useState, useEffect, useCallback } from 'react';
import { withBasePath } from '@/app/_lib/util/links';
import { getCsrfToken } from "@/app/_lib/auth/ory/util";
import { LogoutButton } from "@/app/_ui/auth/logout";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
      let resp = await fetch(withBasePath('/api/ory/login?flow=' + flow.id), 
        {method: 'POST', body: JSON.stringify(body)})
      if (resp.status == 422) {
        let {redirect_browser_to: url} = await resp.json()
        router.replace(url)
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
      height={'100%'}
      p={4}>
      <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2} alignItems="center">
          <Typography variant="h2">Login</Typography>
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

function LoginWithCurrentAccountForm(props: {userSession: any, loginChallenge: string}) {
  const router = useRouter()
  return (      
    <Box 
      display="flex"
      height={'100%'}
      flexDirection={'column'}
      gap={2}
      p={4}>
      <Typography variant="h2">Login</Typography>
      <Typography>Log in to [app] as {props.userSession.identity.traits.email}</Typography>
      <Button onClick={() => acceptWithCurrentAccount(props.loginChallenge, router)}>Sign in</Button>
      <LogoutButton />
    </Box>)
}

function getUserSession(setSession: (value: any) => void) {
  fetch(withBasePath('/api/ory/whoAmI'), {cache: 'no-store'}).then(
    (response) => {
      if (response.status == 200) {
        response.json().then(
          (data) => setSession(data)
        )
      } else {
        setSession(null)
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

async function acceptWithCurrentAccount(loginChallenge: string, router: AppRouterInstance): Promise<void> {
  const response = await fetch(withBasePath(`/api/oauth-login?login_challenge=${loginChallenge}`),
    {
      method: 'POST',
      body: JSON.stringify({remember: true})
    }
  )
  if (response.ok) {
    const data = await response.json()
    window.location.replace(data.redirect_to)
  }
}

function userIsParticipant(userSession: any): boolean {
  return userSession?.identity?.schema_id == "subject"
}

function LoginCard(params: {children: React.ReactElement}) {
  return <Card><Box display={'flex'} alignItems={'center'} justifyContent={'center'} width={300} height={350}>{params.children}</Box></Card>
}

export default function Page() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [userSession, setUserSession] = useState<any>(undefined)
  const [flow, setFlow] = useState<any>();  
  const [content, setContent] = useState<JSX.Element>(<div></div>)

  const loginChallenge = searchParams.get('login_challenge') ?? undefined
  if (loginChallenge == undefined) {
    window.location.replace(withBasePath('/auth/login'))
    return
  }
  let flowId = searchParams.get('flowId')
  useEffect(() => {
    if (userSession === undefined) {
      getUserSession(setUserSession)
    } else if (userSession === null) {
      if (flow == undefined) {
        createLoginFlow(loginChallenge ?? '', setFlow)
      } else {
        setContent(<LoginCard><LoginForm flow={flow}></LoginForm></LoginCard>)
      }
    } else {
      if (userIsParticipant(userSession)) {
        acceptWithCurrentAccount(loginChallenge, router)
        return
      }
      setContent(<LoginCard><LoginWithCurrentAccountForm userSession={userSession} loginChallenge={loginChallenge} /></LoginCard>)
    }
  }, [flow, userSession])
  return content
}
