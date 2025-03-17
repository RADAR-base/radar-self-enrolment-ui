"use client"
import { Button, Container, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import React, { useContext, useEffect, useState } from "react";
import { withBasePath } from "@/app/_lib/util/links";
import { useRouter, useSearchParams } from "next/navigation";
import { RadarCard } from "../base/card";
import Image from 'next/image'
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client";
import { ParticipantContext } from "@/app/_lib/auth/provider.client";

export function FitbitPage() {
  const protocol = useContext(ProtocolContext);
  const participant = useContext(ParticipantContext);
  const router = useRouter()
  const [linkUrl, setLinkUrl] = useState<string | undefined>(undefined)
  const redirect_uri = encodeURIComponent(`/${protocol.studyId}/portal/connect?success=Fitbit`)

  useEffect(() => {
    if (linkUrl == undefined) {
      fetch(withBasePath('/api/connect/rsa?device=FitBit&redirect_uri=' + redirect_uri)).then(
        (resp) => {
          if (resp.ok) {
            resp.text().then(
              (link) => setLinkUrl(link)
            )
          }
        }
      )
    }
  })

  return (
  <Container maxWidth="lg" disableGutters>
    <RadarCard>
      <Grid container spacing={2} padding={3} gap={2} rowGap={4}>
        <Grid size={12} textAlign={'left'}>
          <div>
            <Typography variant="h2">Connect your Fitbit</Typography>
            <Typography variant="body1">
              Please follow the below instructions to connect your Fitbit account and allow us to access your wearable data stored by Fitbit.
              The first step will take you to Fitbit's website, so it may be useful to look through the steps before starting the process.
            </Typography>
          </div>
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 1: Click the "Link Fitbit" button</Typography>
          <Typography variant="body1">This will redirect you away from this page to Fitbit's website. At the end of the process, you will return here.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Button href={linkUrl} variant="contained" disabled={linkUrl == undefined}>Link Fitbit</Button>
        </Grid>
        
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 2: Log in</Typography>
          <Typography variant="body1">If you are not already logged in to your Fitbit account, you will be redirected to a sign in page. Please log in with your Fitbit account.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
              src={withBasePath('/devices/fitbit/fitbit_login.png')}
              width={240}
              height={400}
              alt='A placeholder image which should show the opening screen of the RADAR app'
              style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
            />
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 3: Select the data you want to share</Typography>
          <Typography variant="body1">So that we can learn as much as possible, we would appreciate it if you were able to allow all of the requested data.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
              src={withBasePath('/devices/fitbit/fitbit_scopes.png')}
              width={320}
              height={400}
              alt='A placeholder image which should show the opening screen of the RADAR app'
              style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
            />
        </Grid>
      </Grid>
    </RadarCard>
  </Container>
  )
}