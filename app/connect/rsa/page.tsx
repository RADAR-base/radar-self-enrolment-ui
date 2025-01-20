"use client"

import { authRequestLink } from "@/app/_lib/radar/rest-source/service";
import { withBasePath } from "@/app/_lib/util/links";
import { Box, Card, CircularProgress, Container, Stack } from "@mui/material";
import crypto from "crypto";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
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
            console.log(code)
            const resp = await fetch(withBasePath(`/api/connect/sep?code=${code}`))
            console.log(await resp.json())
            router.push(`/${projectId}/portal`)
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