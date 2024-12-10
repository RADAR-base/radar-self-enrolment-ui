"use client"

import { getAuthLink, authRequestLink, getAccessTokenFromCode } from "@/app/_lib/radar/questionnaire_app/service";
import { Box, Card, CircularProgress, Container, Stack } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { studyId: string} }) {
  const projectId = 'paprka'
  const router = useRouter()
  const [tokenHandled, setTokenHandled] = useState(false)
  const [isFetchingToken, setIsFetchingToken] = useState(false) // Prevent multiple calls
  const code = useSearchParams().get('code')
  
  useEffect(() => {
    const handleToken = async () => {
      if (isFetchingToken || tokenHandled) return
      setIsFetchingToken(true)
      try {
        if (code == null) {
          router.push(authRequestLink())
        } else {
          // const tokenResponse = await getAccessTokenFromCode(code)
          router.push(`/${projectId}/portal/connect/apple_health?code=${code}`)
        }
        // if (tokenResponse?.access_token && tokenResponse?.expires_in) {
        //   tokenResponse['iat'] =  Math.floor(Date.now() / 1000)
        //   const shortToken = { 
        //     iat: tokenResponse.iat, 
        //     expires_in: tokenResponse.expires_in, 
        //     refresh_token: tokenResponse.refresh_token, 
        //     scope: tokenResponse.scope, 
        //     token_type: tokenResponse.token_type }
        //   const url = await getAuthLink(shortToken, projectId)
        //   console.log(url)
      } catch (error) {
        console.log(error)
      }
    }
    handleToken()
  }, [])

  return (
    <main>
    <Container maxWidth="md">
      <Stack m={4} spacing={4} alignItems="center"> 
        <Card><Box display={'flex'} alignItems={'center'} justifyContent={'center'} width={300} height={350}>
          <CircularProgress  sx={{  top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} />
        </Box></Card>
      </Stack>
    </Container>
    </main>
  )}