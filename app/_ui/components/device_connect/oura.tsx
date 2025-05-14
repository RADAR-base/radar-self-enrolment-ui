"use client"
import { Button, Container, Link, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import React, { useContext, useEffect, useState } from "react";
import { withBasePath } from "@/app/_lib/util/links";
import { useRouter, useSearchParams } from "next/navigation";
import { RadarCard } from "../base/card";
import Image from 'next/image'
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client";
import { ParticipantContext } from "@/app/_lib/auth/provider.client";
import NextLink from 'next/link'

export function OuraPage() {
  const protocol = useContext(ProtocolContext);
  const [linkUrl, setLinkUrl] = useState<string | undefined>(undefined)
  const redirect_uri = encodeURIComponent(`/${protocol.studyId}/portal/connect?success=oura`)

  useEffect(() => {
    if (linkUrl == undefined) {
      fetch(withBasePath('/api/connect/rsa?device=Oura&redirect_uri=' + redirect_uri)).then(
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
            <Typography variant="h2">Connect your Oura Ring</Typography>
            <Typography variant="body1">
              Please read the three steps before you connect your Oura Ring account. 
            </Typography>
            <Typography>
              The first step will take you to Oura's website. For the second step <strong>you need to login to your Oura account.</strong> In the third step you will be asked to tick all the 3 boxes in the “Connect with Oura” screen.  
            </Typography>
            <Typography>
              Read our <Link component={NextLink} href={'/study/paprka/resources/guides/PAPrKA_Study_Guide_Oura.docx'}>Guide</Link> or view our <Link>Video</Link> for more detailed instructions on how to share your Oura data.  
            </Typography>
          </div>
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 1: Click the "Link Oura" button</Typography>
          <Typography variant="body1">This will redirect you away from this page to Oura's website.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Button component={Link} href={linkUrl} variant="contained" target='_blank' disabled={linkUrl == undefined}>Link Oura</Button>
        </Grid>


        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 2: Log in</Typography>
          <Typography variant="body1">If you are not already logged in to your Oura account, you will be redirected to a sign in page. Please log in with your Oura account.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
              src={withBasePath('/devices/oura/oura_login.png')}
              width={240}
              height={320}
              alt='An image showing the Oura login page'
              style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
            />
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 3: Select the data you want to share</Typography>
          <Typography variant="body1" mt={2}>Once you have logged in to your Oura account you will see a screen called “Connect with Oura”.  Tick the 3 boxes, and then click “Accept” at the bottom to share your physical activity information with the study.</Typography>
          <Typography variant="body1" fontStyle={'italic'} mt={2}>These 3 boxes capture your physical activity information such as time doing activities, distance travelled, step count, and heart rate which is needed for the study. Any information that we do not need such as sleep will be deleted at the end of the study.</Typography>
          <Typography variant="body1" mt={2}>Once you have completed the 3 steps, you will receive a thank you message that will ask you if you want to link another device or if you are done. Click done, if you are not linking any other device.</Typography>
          <Typography mt={2} variant="body1">If you have any questions about the information we ask for, please contact us on <Link href="mailto:paprka@manchester.ac.uk">paprka@manchester.ac.uk</Link></Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
              src={withBasePath('/devices/oura/oura_scopes.png')}
              width={224}
              height={400}
              alt='An image showing the Oura OAuth Scope page'
              style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
            />
        </Grid>
      </Grid>
    </RadarCard>
  </Container>
  )
}