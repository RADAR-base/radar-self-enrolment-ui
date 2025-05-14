"use client"
import { Box, IconButton, Button, Container, Divider, Grow, List, ListItem, Modal, Typography, useMediaQuery, useTheme, Link } from "@mui/material"
import Grid from '@mui/material/Grid2';
import React, { useContext, useEffect, useState } from "react";
import { withBasePath } from "@/app/_lib/util/links";
import { useRouter} from "next/navigation";
import { RadarCard } from "../base/card";
import {QRCodeSVG} from 'qrcode.react'
import Image from 'next/image'
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client";
import { getAuthLink } from "@/app/_lib/connect/armt/authLink";
import { GetOauthToken } from "../../auth/oauthToken";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NextLink from 'next/link'

const SCOPES = [
  'SOURCETYPE.READ',
  'PROJECT.READ',
  'SUBJECT.READ',
  'SUBJECT.UPDATE',
  'MEASUREMENT.CREATE',
  'SOURCEDATA.CREATE',
  'SOURCETYPE.UPDATE',
  'offline_access'
]
const AUDIENCE = ['res_ManagementPortal', 'res_gateway', 'res_AppServer'].join(' ')

const REDIRECT_URI = process.env.NEXT_PUBLIC_ARMT_REDIRECT_URI ?? ''

function AppStoreDownloadModalContent() {
  const link = 'https://apps.apple.com/us/app/radar-active-rmt/id1483953055?itscg=30200&itsct=apps_box_badge&mttnsubad=1483953055'
  return (
    <React.Fragment>
      <a href={link} target='_blank'>
        <Image
          src={withBasePath('/devices/apple_download_app.svg')}
          height={80}
          width={200}
          alt={"Download the RADAR App on the App Store"}
          style={{cursor: 'pointer'}}
        />
    </a>
    </React.Fragment>
  )
}

function QRContent({armtAuthUrl}: {armtAuthUrl?: string}): React.ReactNode {
  return (
    <Box display={'flex'} flexDirection={'column'} gap={2}>
      <Typography variant="body1">1] If you arrived at the website on your computer or tablet <Typography color="primary" component={'span'} fontWeight={700}>scan this QR code</Typography> when prompted.</Typography>
      <Box margin={'auto'} textAlign={'center'}>
          <QRCodeSVG value={armtAuthUrl ?? ''} size={200} />
      </Box>
      <Typography variant="body1" fontStyle={'italic'}>To use the QR code you must be looking at it on a computer screen/iPad, scan the code using your phone.</Typography>
    </Box>
  )
}

function HealthKitContent({armtAuthUrl}: {armtAuthUrl?: string}): React.ReactNode {
  const protocol = useContext(ProtocolContext);
  const theme = useTheme()

  return (
    <React.Fragment>
      <Grid size={12} textAlign={'left'}>
        <Typography variant="h2">Connect your iPhone or Apple Watch</Typography>
        <Typography>
          Please read the three steps before you connect your iPhone and or Apple Watch account.
        </Typography>
        <Typography>
          Read our <Link component={NextLink} href={'/study/paprka/resources/guides/PAPrKA_Study_Guide_iPhone.docx'}>Guide</Link> or view our <Link>Video</Link> for more detailed instructions on how to share your Apple Health data.  
        </Typography>
      </Grid>
      <Grid size={12} textAlign={'left'}>
        <Typography variant="h3">
          Connect your iPhone or Apple Watch
        </Typography>
        <Typography variant="body1">
          You can take part if you have an iPhone or if you have an iPhone and Apple Watch. 
          To allow us to access your physical activity information you will need to download the 
          study app onto your iPhone and sign into it.
          <strong> Please read step 1 and 2 before you start.</strong>
        </Typography>
      </Grid>
      <Grid size={12} textAlign={'left'}>
      <Typography variant="h3">Step 1: About the study app</Typography>
        <Typography  variant="body1">
          The study app is called <Typography fontWeight={700} color="primary" display={'inline'} component={'span'}>RADAR active RMT</Typography>.
          <br />
          To download the study app, <strong>you will need your iPhone. </strong>
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }} textAlign={'left'}>
        <Typography variant="h3">Step 2: There are two ways to log into the study app once downloaded</Typography> 
      </Grid>
      <Grid size={{xs: 12, sm: 5.5}} textAlign={'left'} >
        <QRContent armtAuthUrl={armtAuthUrl ?? ""} />
      </Grid>
      <Grid size={{xs: 12, sm: 1}} >
        <Divider orientation={useMediaQuery(theme.breakpoints.down("sm")) ? "horizontal" : "vertical"}>OR</Divider>
      </Grid>
      <Grid size={{xs: 12, sm: 5.5}} textAlign={'left'}>
        <div>
          <Typography variant="body1">2] If you arrived at the website on your iPhone, type into the study app when prompted:</Typography>
          <List sx={{listStyle: 'lower-roman'}}>
            <ListItem sx={{display: 'list-item'}}>
              <Typography>
                Study name: 
                <Typography color="primary" component={'span'} fontWeight={700} letterSpacing={2}>
                  {" " + protocol.studyId}
                </Typography>
                <IconButton onClick={() =>navigator.clipboard.writeText(protocol.studyId)}
                  color='primary'
                  >
                  <ContentCopyIcon />
                </IconButton>
              </Typography>
            </ListItem>
            <ListItem sx={{display: 'list-item'}}>
              <Typography>The 
                <Typography color="primary" component={'span'} fontWeight={700}> email address </Typography>
                you used to set up your {protocol.name} study account.
              </Typography>
            </ListItem>
            <ListItem sx={{display: 'list-item'}}>
            <Typography>The 
                <Typography color="primary" component={'span'} fontWeight={700}> password </Typography>
                you used to set up your {protocol.name} study account.
              </Typography>            
            </ListItem>
          </List>
        </div>
      </Grid>
      <Grid size={12} textAlign={'left'}>
        <Typography  variant="h3">
          Step 3: Now you are ready to download the app 
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }} textAlign={'left'}>
        <Typography variant="body1">
          If you arrived at the website on your computer or tablet – take 
          your iPhone and search on the app store for the study 
          app <Typography color='primary' fontWeight={700} component={'span'}>RADAR active RMT</Typography>
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }} alignContent={'center'}>
        <Image
          src={withBasePath('/radar/app_store_armt.png')}
          width={254}
          height={291}
          alt={"RADAR Active RMT app in app store"}
          style={{ borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)', alignSelf: 'center' }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }} textAlign={'left'}>
        <Typography variant="body1">
          If you arrived at the website on your iPhone, click on:
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }} alignContent={'center'}>
        <AppStoreDownloadModalContent />
      </Grid>
      <Grid size={12}>
        <SubmitButton disabled={armtAuthUrl == undefined} />
      </Grid>
    </React.Fragment>
)}

interface SubmitButtonProps {
  disabled?: boolean
}

function SubmitButton(props: SubmitButtonProps) {
  const router = useRouter();
  const protocol = useContext(ProtocolContext);
  return  <Button color="primary" variant="contained" 
                  disabled={props.disabled}
                  onClick={() => {
                    router.push(`/${protocol.studyId}/portal/connect?success=apple_health`)
                  }}
                  >
            Mark as Complete
          </Button>
}


function createShortToken(token: any) {
  if (token?.access_token && token?.expires_in) {
    token['iat'] =  Math.floor(Date.now() / 1000)
    const shortToken = { 
      iat: token.iat, 
      expires_in: token.expires_in, 
      refresh_token: token.refresh_token, 
      scope: token.scope, 
      token_type: token.token_type 
    }
    return shortToken
  }
}


export function HealthKitPage() {
  const [isFetchingToken, setIsFetchingToken] = useState(false)
  const [armtAuthUrl, setArmtAuthUrl] = useState<any>(undefined)

  const [code, setCode] = useState<string>()
  
  useEffect(() => {
    const handleToken = async () => {
      if (isFetchingToken || (armtAuthUrl != undefined) || (code == undefined)) return
      setIsFetchingToken(true)
      const tokenResponse = await fetch(withBasePath('/api/connect/armt/token?code=' + code))
      if (tokenResponse.ok) {
        let token = await tokenResponse.json()
        const url = await getAuthLink(createShortToken(token))
        setArmtAuthUrl(url)
      }
    }
    handleToken()
  }, [code])


  const disabled = false

  return (
  <Container maxWidth="lg" disableGutters >
    <RadarCard>
      <Container sx={{ pl: 4, pr: 4}}>
        {armtAuthUrl == undefined ? 
          (<GetOauthToken clientId="aRMT" scopes={SCOPES} audience={AUDIENCE} codeFunc={setCode} redirectUri={REDIRECT_URI} />) : 
          (<Box display={'inline'} gap={2} aria-live="polite" paddingLeft={4}>
            <Grid container spacing={2} gap={2} rowGap={4}>
              <HealthKitContent armtAuthUrl={armtAuthUrl} />
            </Grid>
            <br />
          </Box>)
        }
      </Container>
    </RadarCard>
  </Container>
  )
}