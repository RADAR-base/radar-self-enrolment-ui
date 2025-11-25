"use client"
import { Box, Button, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useState, useEffect, type JSX } from 'react';
import { withBasePath } from '@/app/_lib/util/links';
import { LogoutButton } from "@/app/_ui/auth/logout";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { RadarCard } from "@/app/_ui/components/base/card";

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

function LoginCard(params: {children: React.ReactElement<any>}) {
  return <RadarCard>
          <Box padding={4} maxWidth={600} justifySelf={'center'} width='100%'>
            {params.children}
          </Box>
        </RadarCard>
}

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [userSession, setUserSession] = useState<any>(undefined)
  const [flow, setFlow] = useState<any>();  
  const [content, setContent] = useState<JSX.Element>(<div></div>)

  const pathname = usePathname()
  const loginChallenge = searchParams.get('login_challenge') ?? undefined

  useEffect(() => {
    if (loginChallenge == undefined) {
      window.location.replace(withBasePath('/auth/login'))
      return
    }
    if (userSession === undefined) {
      getUserSession(setUserSession)
    } else if (userSession === null) {
      window.location.replace(withBasePath(`/auth/login?redirect_to=${"/auth/oauth-login?" + searchParams.toString()}`))
      // if (flow == undefined) {
      //   createLoginFlow(loginChallenge ?? '', setFlow)
      // } else {
      //   setContent(<LoginCard>
      //     <LoginComponent flow={flow}
      //         onLogin={(response?: Response) => {
      //           response?.json().then(
      //             (data) => {
      //               loginaction(redir)
      //               console.log('onLogin redir: ', data['redirect_browser_to'])
      //               router.replace(data['redirect_browser_to'])
      //             }
      //           )
      //         }}/>  
      //   </LoginCard>)
      // }
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
