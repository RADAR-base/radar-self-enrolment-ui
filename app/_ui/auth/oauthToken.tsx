"use client"
import { withBasePath } from "@/app/_lib/util/links"
import { Box, CircularProgress, Link, Stack, Typography } from "@mui/material"
import { useState, useEffect } from "react"

export function GetOauthToken() {
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(withBasePath('/api/oauth/authorize?client=sep'), { method: 'POST' })
      .then(res => {
        if (res.ok) {
          window.location.reload()
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <Box sx={{ alignSelf: 'center', margin: 'auto', pt: 16, pb: 16 }}>
        <Typography m={4}>
          There was a problem connecting to RADAR-base. Please try again later.
          If the problem persists, please reach out to us at{' '}
          <Link href='mailto:radar-base@kcl.ac.uk'>radar-base@kcl.ac.uk</Link>
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ alignSelf: 'center', margin: 'auto', pt: 16, pb: 16 }}>
      <Stack alignContent='center' alignItems='center' justifyContent='center' textAlign='center' gap={2}>
        <CircularProgress />
        <Typography>Authenticating with RADAR-base</Typography>
      </Stack>
    </Box>
  )
}
