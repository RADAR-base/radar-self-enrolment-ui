"use client"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { useFormik } from "formik"
import { withBasePath } from "@/app/_lib/util/links"
import { getCsrfToken } from '@/app/_lib/auth/ory/util'
import { ParticipantContext } from '@/app/_lib/auth/provider.client'

interface RecoveryProps {
    redirectTo?: string
}

export function RecoveryComponent(props: RecoveryProps) {
  const router = useRouter()

  const participant = useContext(ParticipantContext)
  if (participant?.loggedIn) {
    router.back()
  }

  const searchParams = useSearchParams()
  const pathname = usePathname()

  let [errorText, setErrorText] = useState<string>('');
  let [flow, setFlow] = useState<any | undefined>(undefined);

  return (
    <form onSubmit={() => console.log()}>
        <Stack spacing={4} alignItems="flex-start">
        <Typography variant='h1'>Sign In</Typography>
        {errorText && <Typography variant='overline' color='error'>{errorText}</Typography>}
        <TextField
            fullWidth
            id="identifier"
            name="identifier"
            label="Email"
            />
        <Link href={'login'}>Sign In</Link>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width={'100%'}>
          <Button color="primary" variant="contained" onClick={() => router.back()}>
              Back
          </Button>
          <Button color="primary" variant="contained" type="submit" disabled={(flow==undefined)}>
              Recover Account
          </Button>
        </Box>
        </Stack>
    </form>
)}