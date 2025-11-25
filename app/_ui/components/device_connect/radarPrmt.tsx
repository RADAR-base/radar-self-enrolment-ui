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
import { getAuthLink } from "@/app/_lib/connect/prmt/authLink";
import { GetOauthToken } from "../../auth/oauthToken";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NextLink from 'next/link'

const SCOPES = [
  'SUBJECT.READ',
  'SUBJECT.UPDATE',
  'MEASUREMENT.CREATE',
  'offline_access'
]
const AUDIENCE = ['res_ManagementPortal', 'res_gateway', 'res_appconfig'].join(' ')

const REDIRECT_URI = process.env.NEXT_PUBLIC_PRMT_REDIRECT_URI ?? ''

function AppStoreDownloadModalContent() {
  const link = 'https://play.google.com/store/apps/details?id=org.radarcns.detail&hl=en_IN&pli=1'
  return (
    <React.Fragment>
      <a href={link} target='_blank'>
        <Image
          src={withBasePath('/devices/playstore_download_app.webp')}
          height={80}
          width={200}
          alt={"Download the RADAR Passive RMT App on the App Store"}
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

function PrmtContent({armtAuthUrl}: {armtAuthUrl?: string}): React.ReactNode {
  const protocol = useContext(ProtocolContext);
  const theme = useTheme()

  return (
    <React.Fragment>
      <Grid size={12} textAlign={'left'}>
        <Typography variant="h2">Connect your Android phone</Typography>
        <Typography>
          Please read the three steps before you connect the RADAR Passive RMT app to your study.
        </Typography>
        <Typography>
          Learn more about pRMT in the official documentation: <Link component={NextLink} href={'https://www.radar-base.org/docs/prmt/'} target="_blank">pRMT (Passive App)</Link>.  
        </Typography>
      </Grid>
      <Grid size={12} textAlign={'left'}>
        <Typography variant="h3">
          Connect your Android phone
        </Typography>
        <Typography variant="body1">
          You can take part with any compatible Android phone. To allow us to collect phone sensor data, you will need to install the 
          study app on your phone and enrol using a QR code.
          <strong> Please read step 1 and 2 before you start.</strong>
        </Typography>
      </Grid>
      <Grid size={12} textAlign={'left'}>
      <Typography variant="h3">Step 1: About the study app</Typography>
        <Typography  variant="body1">
          The study app is called <Typography fontWeight={700} color="primary" display={'inline'} component={'span'}>RADAR Passive RMT</Typography>.
          <br />
          To download the study app, <strong>you will need your Android phone.</strong>
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }} textAlign={'left'}>
        <Typography variant="h3">Step 2: Enrol in the app</Typography> 
      </Grid>
      <Grid size={{xs: 12, sm: 5.5}} textAlign={'left'} >
        <QRContent armtAuthUrl={armtAuthUrl ?? ""} />
      </Grid>
      <Grid size={{xs: 12, sm: 1}} >
        <Divider orientation={useMediaQuery(theme.breakpoints.down("sm")) ? "horizontal" : "vertical"}>OR</Divider>
      </Grid>
      <Grid size={{xs: 12, sm: 5.5}} textAlign={'left'}>
        <div>
          <Typography variant="body1">2] If you are viewing this page on your Android phone, tap the link below to open the pRMT app and enrol directly:</Typography>
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
          Step 3: Install the app 
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }} textAlign={'left'}>
        <Typography variant="body1">
          If you arrived at the website on your computer or tablet – take 
          your phone and search on the Play Store for the study 
          app <Typography color='primary' fontWeight={700} component={'span'}>RADAR Passive RMT</Typography>
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }} alignContent={'center'}>
        <Image
          src={withBasePath('/radar/playstore_prmt.png')}
          width={254}
          height={291}
          alt={"RADAR Passive RMT app in Play Store"}
          style={{ borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)', alignSelf: 'center' }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }} textAlign={'left'}>
        <Typography variant="body1">
          If you arrived at the website on your Android device, click on:
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


export function PrmtPage() {
  const [isFetchingToken, setIsFetchingToken] = useState(false)
  const [armtAuthUrl, setArmtAuthUrl] = useState<any>(undefined)

  const [code, setCode] = useState<string>()
  
  useEffect(() => {
    const handleToken = async () => {
      if (isFetchingToken || (armtAuthUrl != undefined) || (code == undefined)) return
      setIsFetchingToken(true)
      const tokenResponse = await fetch(withBasePath('/api/connect/prmt/token?code=' + code))
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
          (<GetOauthToken clientId="pRMT" scopes={SCOPES} audience={AUDIENCE} codeFunc={async (code:string) => setCode(code)} redirectUri={REDIRECT_URI} />) : 
          (<Box display={'inline'} gap={2} aria-live="polite" paddingLeft={4}>
            <Grid container spacing={2} gap={2} rowGap={4}>
              <PrmtContent armtAuthUrl={armtAuthUrl} />
            </Grid>
            <br />
          </Box>)
        }
      </Container>
    </RadarCard>
  </Container>
  )
}