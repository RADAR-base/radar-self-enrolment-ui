import { Button, Container, Typography, Link } from "@mui/material"
import Grid from '@mui/material/Grid2';
import React from "react";
import { withBasePath } from "@/app/_lib/util/links";
import { RadarCard } from "../base/card";
import Image from 'next/image'
import NextLink from 'next/link'


export function FitbitPage() {
  const linkUrl = withBasePath('/api/connect/rsa?device=FitBit')
  return (
  <Container maxWidth="lg" disableGutters>
    <RadarCard>
      <Grid container spacing={2} padding={3} gap={2} rowGap={4}>
        <Grid size={12} textAlign={'left'}>
          <div>
            <Typography variant="h2">Connect your Fitbit</Typography>
            <Typography variant="body1">
              Please read the three steps before you connect your Fitbit account. 
            </Typography>
            <Typography variant="body1">
              The first step will take you to Fitbit's website. For the second step <strong>you need to login to your Fitbit account.</strong> In the third step you will be asked to tick all the boxes in the Fitbit screen.
            </Typography>
            <Typography>
              Read our <Link component={NextLink} href={'/study/paprka/resources/guides/PAPrKA_Study_Guide_Fitbit.pdf'}>Guide</Link> or view our <Link>Video</Link> for more detailed instructions on how to share your Fitbit data.  
            </Typography>
          </div>
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 1: Click the "Link Fitbit" button</Typography>
          <Typography variant="body1">This will redirect you away from this page to Fitbit's website.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Button component={Link} href={linkUrl} variant="contained" target='_blank' disabled={linkUrl == undefined}>Link Fitbit</Button>
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
              alt='An image showing the Fitbit login page'
              style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
            />
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 3: Select the data you want to share</Typography>
          <Typography mt={2} variant="body1">Once you have logged in to your account you will see a screen called Fitbit. Tick *both boxes, and then click “Allow” at the bottom to share your physical activity information with the study.</Typography>
          <Typography mt={2} variant="body1" fontStyle={'italic'}>* These 2 boxes capture your physical activity information such as time doing activities, distance travelled, step count, and heart rate which is needed for the PAPrKA study.</Typography>
          <Typography mt={2} variant="body1">Once you have completed the three steps, you will receive a message that will ask you if you want to link another device or if you are done. Click done, if you are not linking any other device.</Typography>
          <Typography mt={2} variant="body1">If you have any questions about the information we ask for, please contact us on <Link href="mailto:paprka@manchester.ac.uk">paprka@manchester.ac.uk</Link></Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
              src={withBasePath('/devices/fitbit/fitbit_scopes.png')}
              width={380}
              height={320}
              alt='An image showing the Fitbit OAuth scopes page'
              style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
            />
        </Grid>
      </Grid>
    </RadarCard>
  </Container>
  )
}