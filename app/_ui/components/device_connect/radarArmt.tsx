"use client"
import { Box, Button, Container, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import React, { useContext, useEffect, useState } from "react";
import { withBasePath } from "@/app/_lib/util/links";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RadarCard } from "../base/card";
import {QRCodeSVG} from 'qrcode.react'
import Image from 'next/image'
import { getAccessTokenFromCode, getAuthLink } from "@/app/_lib/radar/questionnaire_app/service";
import NextButton from "../base/nextButton";
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client";

export function ArmtPage() {
  const protocol = useContext(ProtocolContext);

  const studyId = protocol.studyId
  const router = useRouter()
  const pathname = usePathname()
  const code = useSearchParams().get('code')
  const [isFetchingToken, setIsFetchingToken] = useState(false)
  const [tokenHandled, setTokenHandled] = useState<boolean>(false)
  const [qrCode, setQrCode] = useState<any>(undefined)


  if ((code == undefined) && (qrCode == undefined) && (isFetchingToken == false)) {
    window.location.replace(withBasePath(`/connect/armt?return_to=/${studyId}/portal/connect/radar_armt`))
  }
  
  useEffect(() => {
    const handleToken = async () => {
      if (isFetchingToken || tokenHandled) return
      if (code) {
        setIsFetchingToken(true)
        const tokenResponse = await getAccessTokenFromCode(code)
        if (tokenResponse?.access_token && tokenResponse?.expires_in) {
          tokenResponse['iat'] =  Math.floor(Date.now() / 1000)
          const shortToken = { 
            iat: tokenResponse.iat, 
            expires_in: tokenResponse.expires_in, 
            refresh_token: tokenResponse.refresh_token, 
            scope: tokenResponse.scope, 
            token_type: tokenResponse.token_type 
          }
          const url = await getAuthLink(shortToken, studyId)
          setQrCode(url)
          setTokenHandled(true)
          router.replace(pathname)
        }
      }
    }
    handleToken()
  }, [code, isFetchingToken])

  return (
  <Container maxWidth="lg" disableGutters>
    <RadarCard>
      <Grid container spacing={2} padding={3} gap={2} rowGap={4}>
        <Grid size={12} textAlign={'left'}>
          <div>
            <Typography variant="h2">Connect to RADAR Active RMT</Typography>
            <Typography variant="body1">
              {"The RADAR Active RMT app is the app that allows user to answer questionnaires and perform timed tasks (termed in RADAR parlance 'active remote monitoring'. Please follow the steps below to link your RADAR Active RMT to our study.\n"
              }
            </Typography>
          </div>
        </Grid>
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 1: Download the app</Typography>
          <Typography variant="body1">This study uses the RADAR aRMT app to access Apple data. You will need to download the app from the Apple App Store or Google Playstore.</Typography>
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
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            {qrCode && <QRCodeSVG value={qrCode} size={200} />}
            <NextButton href={`/connect/armt?return_to=/${studyId}/portal/connect/radar_armt`}>Generate QR Code</NextButton>
          </Box>
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