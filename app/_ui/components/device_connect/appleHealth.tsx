"use client"
import { Box, Button, Container, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import React, { useContext, useEffect, useState } from "react";
import { withBasePath } from "@/app/_lib/util/links";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RadarCard } from "../base/card";
import {QRCodeSVG} from 'qrcode.react'
import Image from 'next/image'
import NextButton from "../base/nextButton";
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client";
import { getAuthLink } from "@/app/_lib/connect/armt/authLink";
import { isMobile, isTablet } from 'react-device-detect';

function MobileContent({armtAuthUrl}: {armtAuthUrl: string}) {
  return <React.Fragment>
    <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
      <Typography variant="h3">Using your phone now?</Typography>
      <Typography variant="body1">Once the RADAR app is installed, if you are using the same phone to view this website, press the following button to enter the app now and skip to Step 5</Typography>
    </Grid>
    <Grid size={{xs: 12, sm: 6}}>
      <Button href={armtAuthUrl} variant={"contained"}>Open Study App</Button>
    </Grid>
  </React.Fragment>
}


export function HealthKitPage() {
  const protocol = useContext(ProtocolContext);
  const studyId = protocol.studyId
  const router = useRouter()
  const pathname = usePathname()
  const code = useSearchParams().get('code')
  const [isFetchingToken, setIsFetchingToken] = useState(false)
  const [armtAuthUrl, setArmtAuthUrl] = useState<any>(undefined)

  if ((code == undefined) && (armtAuthUrl == undefined) && (isFetchingToken == false)) {
    router.replace(`/connect/armt?return_to=/${studyId}/portal/connect/apple_health`)
  }
  
  useEffect(() => {
    const handleToken = async () => {
      if (isFetchingToken || (armtAuthUrl != undefined) || (code == undefined)) return
      setIsFetchingToken(true)
      const tokenResponse = await fetch(withBasePath('/api/connect/armt/token?code=' + code))
      if (tokenResponse.ok) {
        let token = await tokenResponse.json()
        console.log(token)
        if (token?.access_token && token?.expires_in) {
          token['iat'] =  Math.floor(Date.now() / 1000)
          const shortToken = { 
            iat: token.iat, 
            expires_in: token.expires_in, 
            refresh_token: token.refresh_token, 
            scope: token.scope, 
            token_type: token.token_type 
          }
          const url = await getAuthLink(shortToken)
          setArmtAuthUrl(url)
        }
      }
      // setIsFetchingToken(false)
      router.replace(pathname)
    }
    handleToken()
  }, [code, isFetchingToken])

  return (
  <Container maxWidth="lg" disableGutters>
    <RadarCard>
      <Grid container spacing={2} padding={3} gap={2} rowGap={4}>
        <Grid size={12} textAlign={'left'}>
          <div>
            <Typography variant="h2">Connect to Apple Health</Typography>
            <Typography variant="body1">
              {"Apple Health is the app which collects all Apple devices use to organise your health and fitness data. All your Apple Watch and iPhone data relating to health is stored there. That information can only be accessed from apps installed on an iOS device. Please follow the steps below to link your Apple Health data to our study.\n\nIt is also possible to connect other, non-Apple, devices to Apple Health. If you have already done so, you can share that data with us by following the same steps below.\n"}
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
        {(isMobile || isTablet) && <MobileContent armtAuthUrl={armtAuthUrl} />}
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
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            {armtAuthUrl && <QRCodeSVG value={armtAuthUrl} size={200} />}
            <NextButton href={`/connect/armt?return_to=/${pathname}`}>Generate QR Code</NextButton>
            <Button></Button>
          </Box>
        </Grid>
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 5: Complete the Apple Health task</Typography>
          <Typography variant="body1"></Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          Image
        </Grid>
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 6: Done</Typography>
          <Typography variant="body1">Once the app has finished, you can continue with this website's tasks. Press the following 'Finish' button to continue</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Button variant={'contained'} fullWidth sx={{maxWidth: 200}} onClick={() => router.push('./')}>
            Finish
          </Button>
        </Grid>
      </Grid>
    </RadarCard>
  </Container>
  )
}