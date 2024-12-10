"use client"

import { getAuthLink, authRequestLink, getAccessTokenFromCode } from "@/app/_lib/radar/questionnaire_app/service";
import { Box, Card, CircularProgress, Container, Stack } from "@mui/material";
import crypto from "crypto";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { studyId: string} }) {
  const projectId = 'paprka'
  const router = useRouter()
  const [tokenHandled, setTokenHandled] = useState(false)
  const [isFetchingToken, setIsFetchingToken] = useState(false) // Prevent multiple calls
  const code = useSearchParams().get('code')
  const error = useSearchParams().get('error')
  const state = crypto.randomBytes(20).toString('hex')

  useEffect(() => {
    const handleToken = async () => {
      if (isFetchingToken || tokenHandled) return
      setIsFetchingToken(true)
      try {
        if (error == null) {
          if (code == null) {
            router.push(authRequestLink(state))
          } else {
            router.push(`/${projectId}/portal/connect/apple_health?code=${code}`)
          }
        }
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
          {error ? error : <CircularProgress  sx={{  top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} />}
        </Box></Card>
      </Stack>
    </Container>
    </main>
  )}