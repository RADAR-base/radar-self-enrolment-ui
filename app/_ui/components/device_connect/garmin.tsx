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

export function GarminPage() {
  const protocol = useContext(ProtocolContext);
  const participant = useContext(ParticipantContext);
  
  const searchParams = useSearchParams()
  const router = useRouter()

  const [linkUrl, setLinkUrl] = useState<string | undefined>(undefined)
  const redirect_uri = encodeURIComponent(`/${protocol.studyId}/portal/connect?success=Garmin`)

  useEffect(() => {
    if (linkUrl == undefined) {
      fetch(withBasePath('/api/connect/rsa?device=Garmin&redirect_uri=' + redirect_uri)).then(
        (resp) => {
          if (resp.ok) {
            resp.text().then(
              (link) => setLinkUrl(link)
            )
          }
        }
      )
    }
  }, [linkUrl])

  return (
  <Container maxWidth="lg" disableGutters>
    <RadarCard>
      <Grid container spacing={2} padding={3} gap={2} rowGap={4}>
        <Grid size={12} textAlign={'left'}>
          <div>
            <Typography variant="h2">Connect your Garmin</Typography>
            <Typography variant="body1">
              Please follow the below instructions to connect your Garmin account and allow us to access your wearable data stored by Garmin.
              The first step will take you to Garmin's website, so it may be useful to look through the steps before starting the process.
            </Typography>
          </div>
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 1: Click the "Link Garmin" button</Typography>
          <Typography variant="body1">This will redirect you away from this page to Garmin's website. At the end of the process, you will return here.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Button href={linkUrl} variant="contained" disabled={linkUrl == undefined}>Link Garmin</Button>
        </Grid>
      </Grid>
    </RadarCard>
  </Container>
  )
}