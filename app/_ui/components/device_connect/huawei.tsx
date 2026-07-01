import { Button, Container, Typography, Link } from "@mui/material"
import Grid from '@mui/material/Grid2';
import React from "react";
import { withBasePath } from "@/app/_lib/util/links";
import { RadarCard } from "../base/card";
import Image from 'next/image'


interface HuaweiPageProps {
  guideUrl?: string
  videoUrl?: string
}

export function HuaweiPage({ guideUrl, videoUrl }: HuaweiPageProps) {
  const linkUrl = withBasePath('/api/connect/rsa?device=Huawei')
  return (
  <Container maxWidth="lg" disableGutters>
    <RadarCard>
      <Grid container spacing={2} padding={3} gap={2} rowGap={4}>
        <Grid size={12} textAlign={'left'}>
          <div>
            <Typography variant="h2">Connect your Huawei Watch</Typography>
            <Typography variant="body1">
              Please read the three steps before you connect your Huawei Health account.
            </Typography>
            <Typography variant="body1">
              The first step will take you to Huawei&apos;s website. For the second step <strong>you need to log in to your Huawei ID.</strong> In the third step you will be asked to grant access to your health and fitness data on the Huawei Health consent screen.
            </Typography>
            <Typography>
              {guideUrl && <>Read our <Link href={withBasePath(guideUrl)} target="_blank">Guide</Link>{videoUrl ? ' or view our ' : ''}</>}
              {videoUrl && <><Link href={withBasePath(videoUrl!)} target="_blank">Video</Link>{' for more detailed instructions on how to share your Huawei Health data.'}</>}
            </Typography>
          </div>
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 1: Click the &quot;Link Huawei&quot; button</Typography>
          <Typography variant="body1">This will redirect you away from this page to Huawei&apos;s website.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Button component={Link} href={linkUrl} variant="contained" target='_blank' disabled={linkUrl == undefined}>Link Huawei</Button>
        </Grid>
        
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 2: Log in</Typography>
          <Typography variant="body1">If you are not already logged in to your Huawei ID, you will be redirected to a sign in page. Please log in with the Huawei account linked to your Huawei Health data.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
              src={withBasePath('/devices/huawei/huawei_login.png')}
              width={380}
              height={320}
              alt='An image showing the Huawei ID login page'
              style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
            />
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 3: Select the data you want to share</Typography>
          <Typography mt={2} variant="body1">Once you have logged in to your account you will see the Huawei Health authorisation screen. Review the permissions requested, grant access to your health and fitness data, and then click &quot;Allow&quot; to share your wearable device data with the study.</Typography>
          <Typography mt={2} variant="body1" fontStyle={'italic'}>These permissions capture wearable device data such as step count, heart rate, movement, and distance, which is needed for the study.</Typography>
          <Typography mt={2} variant="body1">Once you have completed the three steps, you will receive a message that will ask you if you want to link another device or if you are done. Click done, if you are not linking any other device.</Typography>
          <Typography mt={2} variant="body1">If you have any questions about the information we ask for, please find our contact details at the bottom of the page.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
              src={withBasePath('/devices/huawei/huawei_scopes.png')}
              width={380}
              height={320}
              alt='An image showing the Huawei Health OAuth consent page'
              style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
            />
        </Grid>
      </Grid>
    </RadarCard>
  </Container>
  )
}
