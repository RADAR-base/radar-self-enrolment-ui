"use client"
import { Box, IconButton, Button, Container, Divider, List, ListItem, Typography, useMediaQuery, useTheme, Link } from "@mui/material"
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
  return (<Box>
    <Typography variant="body1" fontWeight={700}>If you're on a computer or tablet</Typography>
    <Typography>When prompted, scan this QR code to log in:</Typography>
    <Box margin={'auto'} textAlign={'center'} padding={2}>
        <QRCodeSVG value={armtAuthUrl ?? ''} size={200} />
    </Box>
    </Box>
    )
}

function LoginInfoContent({studyId, studyName}: {studyId: string, studyName: string}): React.ReactNode {
return (<div>
          <Typography variant="body1" fontWeight={700}>If you're using an iPhone to view this page:</Typography>
            <Typography>Log in manually using:</Typography>
            <List sx={{listStyle: 'lower-roman'}}>
              <ListItem sx={{display: 'list-item'}}>
                <Typography>
                  Study name: 
                  <Typography color="primary" component={'span'} fontWeight={700} letterSpacing={2}>
                    {" " + studyId}
                  </Typography>
                  <IconButton onClick={() =>navigator.clipboard.writeText(studyId)}
                    color='primary'
                    >
                    <ContentCopyIcon />
                  </IconButton>
                </Typography>
              </ListItem>
              <ListItem sx={{display: 'list-item'}}>
                <Typography>
                  Email address: the one you used for your {studyName} account.
                </Typography>
              </ListItem>
              <ListItem sx={{display: 'list-item'}}>
              <Typography>
                Password: the one you used for your {studyName} account.
                </Typography>            
              </ListItem>
              <Typography fontStyle={'italic'}>Note: You <strong>do not need</strong> your Apple ID or password.</Typography>
            </List>
        </div>)
}

function HealthKitContent({armtAuthUrl}: {armtAuthUrl?: string}): React.ReactNode {
  const protocol = useContext(ProtocolContext);
  const theme = useTheme()
  return (
    <React.Fragment>
      <Grid size={12} textAlign={'left'}>
        <Typography variant="h2">How to Connect Your iPhone or Apple Watch</Typography>
        <Typography>
          You can share data with us if you have an iPhone (6s or newer), or both an iPhone and an Apple Watch. 
        </Typography>
        <Typography>
          We will ask you to download an app so you can send us a copy of your activity data
        </Typography>
        <Typography variant="h3" padding={2} textAlign={'center'}>
          Before you start please read through all the steps below. 
        </Typography>
        <Typography>
          Read our <Link href={"/study/study/paprka/resources/guides/Study_Guide_iPhone.pdf"} target='_blank'>Guide</Link> or view our <Link>Video</Link> for more detailed instructions on how to share your Apple data. 
        </Typography>
      </Grid>
      <Grid size={12} textAlign={'left'}>
        <Typography  variant="h3">
          Step 1: Download the App
        </Typography>
      </Grid>

      <Grid size={{xs: 12, sm: 5.5}} textAlign={'left'} >
        <Typography variant="body1" fontWeight={700}>
          If you're on a computer or tablet: 
        </Typography>
        <List  sx={{listStyle: 'lower-alpha'}}>
          <ListItem sx={{display: 'list-item'}}>
            <Typography>On your iPhone, open the App Store.</Typography>
          </ListItem>
          <ListItem sx={{display: 'list-item'}}>
            <Typography>Search for <Typography color='primary' fontWeight={700} component={'span'}>RADAR active RMT</Typography></Typography>
          </ListItem>
        </List>
        <Image
          src={withBasePath('/radar/app_store_armt.png')}
          width={254}
          height={291}
          alt={"RADAR Active RMT app in app store"}
          style={{ borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)', alignSelf: 'center' }}
        />
      </Grid>
      <Grid size={{xs: 12, sm: 1}} >
        <Divider orientation={useMediaQuery(theme.breakpoints.down("sm")) ? "horizontal" : "vertical"}>OR</Divider>
      </Grid>
      <Grid size={{xs: 12, sm: 5.5}} textAlign={'left'}>
        <Typography variant="body1" fontWeight={700}>
          If you're on your iPhone:
        </Typography>
        <Typography>Tap below to download directly:</Typography>
        <AppStoreDownloadModalContent />
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }} textAlign={'left'}>
        <Typography variant="h3">Step 2: Log into the app</Typography> 
        <Typography variant="body1" fontWeight={700}>
          There are two ways to log into the app once it's installed 
        </Typography>
      </Grid>
      <Grid size={{xs: 12, sm: 5.5}} textAlign={'left'} >
        <QRContent armtAuthUrl={armtAuthUrl ?? ""} />
      </Grid>
      <Grid size={{xs: 12, sm: 1}} >
        <Divider orientation={useMediaQuery(theme.breakpoints.down("sm")) ? "horizontal" : "vertical"}>OR</Divider>
      </Grid>
      <Grid size={{xs: 12, sm: 5.5}} textAlign={'left'}>
        <LoginInfoContent studyId={protocol.studyId} studyName={protocol.name} />
      </Grid>
      <Grid size={12} textAlign={'left'}>
        <Typography  variant="h3">
          Step 3
        </Typography>
        <Typography>After you've connected your iPhone and shared your data:</Typography>
        <List sx={{listStyle: 'disc'}}>
          <ListItem sx={{display: 'list-item'}}>
            <Typography>Return to this website</Typography>
          </ListItem>
          <ListItem sx={{display: 'list-item'}}>
            <Typography>Click the green 'Mark as complete' button.</Typography>
          </ListItem>
          <ListItem sx={{display: 'list-item'}}>
            <Typography>You’ll then be asked if you want to connect another device.</Typography>
            <div>
            <List sx={{listStyle: 'circle'}}>
              <ListItem sx={{display: 'list-item'}}>
                <Typography>If not, just click 'Done'</Typography>
              </ListItem>
            </List>
            </div>
          </ListItem>
        </List>
        <Typography>If you have any questions, contact us at: <Link href='mailto:paprka@manchester.ac.uk'>paprka@manchester.ac.uk</Link></Typography>
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
          (<GetOauthToken clientId="aRMT" scopes={SCOPES} audience={AUDIENCE} codeFunc={async (code:string) => setCode(code)} redirectUri={REDIRECT_URI} />) : 
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