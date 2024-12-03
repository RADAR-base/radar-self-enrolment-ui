"use client"
import { Button, Container, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import { StudyProtocol } from "@/app/_lib/study/protocol";
import React, { useState } from "react";
import { withBasePath } from "@/app/_lib/util/links";
import { useRouter } from "next/navigation";
import { RadarCard } from "../base/card";
import {QRCodeSVG} from 'qrcode.react'
import Image from 'next/image'

interface HealthKitPageProps {
  protocol: StudyProtocol
}

export function HealthKitPage(props: HealthKitPageProps) {
  const studyId = props.protocol.studyId
  const router = useRouter()
  return (
  <Container maxWidth="lg" disableGutters>
    <RadarCard>
      <Grid container spacing={2} padding={3} gap={2} rowGap={4}>
        <Grid size={12} textAlign={'left'}>
          <div>
            <Typography variant="h2">Connect to Apple Health</Typography>
            <Typography variant="body1">
              {"Apple Health is the app which collects all Apple devices use to organise your health and fitness data. All your Apple Watch and iPhone data relating to health is stored there. It is also possible to connect other wearable devices.\n"
              }
            </Typography>
          </div>
        </Grid>
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 1: Download the app</Typography>
          <Typography variant="body1">This study uses the RADAR aRMT app to access Apple data. If you would like you share your Apple Health data with us, you will need to download the app on your iOS device.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <a href="https://apps.apple.com/us/app/radar-active-rmt/id1483953055?itscg=30200&itsct=apps_box_badge&mttnsubad=1483953055" style={{display: "inline-block"}} target="_blank">
          <Image
            src={withBasePath('/devices/apple_download_app.svg')}
            height={80}
            width={200}
            alt={"Download the RADAR App on the App Store"}
            /> 
          </a>   
      
        </Grid>
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 2: Open the app</Typography>
          <Typography variant="body1">Once the app is opened, you will see the following screen. Press the 'Start' button.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
            src={withBasePath('/radar/app/app_start_screen.png')}
            width={280}
            height={500}
            alt='A placeholder image which should show the opening screen of the RADAR app'
            style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 3: Press 'Scan'</Typography>
          <Typography variant="body1">Press the 'Scan' button to enable the QR code scanner</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
            src={withBasePath('/radar/app/app_scan_screen.png')}
            width={280}
            height={500}
            alt='A placeholder image which should show the opening screen of the RADAR app'
            style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 4: Scan the QR Code</Typography>
          <Typography variant="body1">While the app is showing the scanning screen, point it at the following QR code. Scanning the QR code will connect the app to this study.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <QRCodeSVG value={process.env.NEXT_PUBLIC_HYDRA_PUBLIC_URL + "?projectId=" + studyId} size={200} />
        </Grid>
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 5: Log in</Typography>
          <Typography variant="body1">Enter the account details you created for this study to log in to the app</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          Image
        </Grid>
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 6: Complete the Apple Health task</Typography>
          <Typography variant="body1"></Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          Image
        </Grid>
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 7: Done</Typography>
          <Typography variant="body1">Once the app has finished, you can continue with this website's tasks. Press the following 'Finish' button to continue</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Button variant={'contained'} fullWidth sx={{maxWidth: 200}}
            onClick={() => router.push('./')}
          >
            Finish
          </Button>
        </Grid>
      </Grid>
      
    </RadarCard>
  </Container>
  )
}