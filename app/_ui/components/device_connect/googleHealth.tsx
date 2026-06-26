import { Box, Button, Container, Typography, Link } from "@mui/material"
import Grid from '@mui/material/Grid2';
import React from "react";
import { withBasePath } from "@/app/_lib/util/links";
import { RadarCard } from "../base/card";
import Image from 'next/image'

const GOOGLE_PRIVACY_POLICY_URL = 'https://radar-base.org/google-privacy-policy/'

interface GoogleHealthPageProps {
  guideUrl?: string
  videoUrl?: string
}

export function GoogleHealthPage({ guideUrl, videoUrl }: GoogleHealthPageProps) {
  const linkUrl = withBasePath('/api/connect/rsa?device=GoogleHealth')
  return (
  <Container maxWidth="lg" disableGutters>
    <RadarCard>
      <Grid container spacing={2} padding={3} gap={2} rowGap={4}>
        <Grid size={12} textAlign={'left'}>
          <div>
            <Typography variant="h2">Connect your Google Health</Typography>
            <Typography variant="body1">
              Please read the three steps before you connect your Google account.
            </Typography>
            <Typography variant="body1">
              The first step will take you to Google&apos;s website. For the second step <strong>you need to log in to your Google account.</strong> In the third step you will be asked to grant access to your health data on the Google consent screen.
            </Typography>
            <Typography>
              {guideUrl && <>Read our <Link href={withBasePath(guideUrl)} target="_blank">Guide</Link>{videoUrl ? ' or view our ' : ''}</>}
              {videoUrl && <><Link href={withBasePath(videoUrl!)} target="_blank">Video</Link>{' for more detailed instructions on how to share your Google Health data.'}</>}
            </Typography>
          </div>
        </Grid>

        <Grid size={12} textAlign={'left'}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              backgroundColor: 'action.hover',
              p: 3,
            }}
          >
            <Typography variant="h3" gutterBottom>
              How RADAR-base uses your Google Health data
            </Typography>
            <Typography variant="body1">
              This study uses RADAR-base to collect health and fitness data from your Google account, including your activity (steps, exercise sessions, calories), sleep, heart rate, heart-rate variability, blood oxygen, respiratory rate, ECG recordings, irregular rhythm notifications, and GPS location recorded during exercise. This enables the remote health monitoring you consented to as part of this study.
            </Typography>
            <Typography variant="body1" mt={2}>
              RADAR-base requests read-only access and never changes the data in your Google account. Your data is shared only with this study&apos;s research team, is never used for advertising, and is never sold. You can disconnect your Google account at any time. For full details, read our{' '}
              <Link href={GOOGLE_PRIVACY_POLICY_URL} target="_blank">Google data Privacy Policy</Link>.
            </Typography>
          </Box>
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 1: Click the &quot;Link Google Health&quot; button</Typography>
          <Typography variant="body1">This will redirect you away from this page to Google&apos;s website.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Button
            component={Link}
            href={linkUrl}
            variant="contained"
            target='_blank'
            disabled={linkUrl == undefined}
            startIcon={
              <Box
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 1,
                  p: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Image
                  src={withBasePath('/devices/google_health.png')}
                  width={20}
                  height={20}
                  alt=""
                />
              </Box>
            }
          >
            Link Google Health
          </Button>
        </Grid>
        
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 2: Log in</Typography>
          <Typography variant="body1">If you are not already logged in to your Google account, you will be redirected to a sign in page. Please log in with the Google account linked to your health and fitness data.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
              src={withBasePath('/devices/google_health/google_health_login.png')}
              width={380}
              height={320}
              alt='An image showing the Google login page'
              style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
            />
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 3: Select the data you want to share</Typography>
          <Typography mt={2} variant="body1">Once you have logged in to your account you will see a Google consent screen. Review the permissions requested, grant access to your health data, and then click &quot;Continue&quot; to share your wearable device data with the study.</Typography>
          <Typography mt={2} variant="body1" fontStyle={'italic'}>These permissions cover your activity (steps, exercise, calories), sleep, heart rate and related vital signs, ECG, irregular rhythm notifications, and GPS location during exercise, which the study needs.</Typography>
          <Typography mt={2} variant="body1">Once you have completed the three steps, you will receive a message that will ask you if you want to link another device or if you are done. Click done, if you are not linking any other device.</Typography>
          <Typography mt={2} variant="body1">If you have any questions about the information we ask for, please find our contact details at the bottom of the page.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
              src={withBasePath('/devices/google_health/google_health_scopes.png')}
              width={380}
              height={440}
              alt='An image showing the Google Health OAuth consent page'
              style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
            />
        </Grid>
      </Grid>
    </RadarCard>
  </Container>
  )
}
