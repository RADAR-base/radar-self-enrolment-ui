"use client"
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Divider, Grow, List, ListItem, Modal, Typography, useMediaQuery, useTheme } from "@mui/material"
import Grid from '@mui/material/Grid2';
import React, { useContext, useEffect, useState } from "react";
import { withBasePath } from "@/app/_lib/util/links";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RadarCard } from "../base/card";
import {QRCodeSVG} from 'qrcode.react'
import Image from 'next/image'
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client";
import { getAuthLink } from "@/app/_lib/connect/armt/authLink";
import { isMobile, isTablet } from 'react-device-detect';
import StepperProgress from "../base/stepperProgress";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { BorderLeft } from "@mui/icons-material";
import { GetOauthToken } from "../../auth/oauthToken";

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
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
    <Image
      src={withBasePath('/devices/apple_download_app.svg')}
      height={80}
      width={200}
      alt={"Download the RADAR App on the App Store"}
      onClick={handleOpen}
      style={{cursor: 'pointer'}}
    />
    <Modal
      open={open}
      onClose={handleClose}
      >
      <Box sx={{
        marginInline: 'auto',
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -30%)',
        minWidth: 400,
        maxWidth: 600,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 16,
        p: 4}}>
        <Typography id="modal-modal-title" variant="h3">
          Download app
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Please click download to install the RADAR aRMT App from the App Store.
          <br />
          Once you have installed the app, <strong>please return to this website to log in</strong>
        </Typography>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} marginTop={2} gap={1}> 
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Button href={link} onClick={handleClose} variant="outlined" target="_blank">Download</Button>
        </Box>
      </Box>
    </Modal>
    </React.Fragment>
  )
}

function StepIntroContent(): React.ReactNode {
  return (
    <React.Fragment>
      <Grid size={{ xs: 12, sm: 8 }} textAlign={'left'}>
        <div>
          <Typography variant="h2">Connect to Apple Health</Typography>
          <Typography variant="body1">
            Apple Health collects your Apple health and fitness data. All your Apple Watch and iPhone data relating to health is stored there. That information can only be accessed from apps installed on an iOS device. Please complete the following steps to link your Apple Health data to our study.
            <br />
            <br />
            It is also possible to connect other, non-Apple, devices to Apple Health. If you have already done so, you can share that data with us by following the same steps below.
          </Typography>
        </div>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }} alignContent={'center'}>
        <Image
          src={withBasePath('/devices/radar_armt.png')}
          width={120}
          height={120}
          alt={"RADAR Active RMT app icon"}
          style={{ borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)' }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }} textAlign={'left'}>
        <Typography variant="h3">Step 1: Download the app</Typography>
        <Typography variant="body1">
          This study uses the RADAR active RMT app to access Apple Health data.
          <br />
          To share your Apple Health data with us, you will need to download the app on your iOS device.
          <br />
          <strong>Once installed, please return here to log in to the app</strong>
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }} alignContent={'center'}>
        <AppStoreDownloadModalContent />
      </Grid>
    </React.Fragment>
)}

interface StepLoginContentProps {
  armtAuthUrl?: string
}

function StepLoginContent({armtAuthUrl}: StepLoginContentProps): React.ReactNode {
  const theme = useTheme()
  return (
    <React.Fragment>
      <Grid size={12} textAlign={'left'}>
        <div>
          <Typography variant="h2">Connect to Apple Health</Typography>
          <br />
          <Typography variant="h3">Step 2: Log in</Typography>
          <Typography variant="body1">
            You can log in to the app by scanning the following QR code{isMobile ? ", clicking the login button below if you are currently using your iOS device, " : " "} 
            or logging in with your email and password.
          </Typography>
        </div>
      </Grid>
      <Grid size={{xs: 12, sm: 5.5}} textAlign={'left'} >
        {isMobile ? <MobileContent armtAuthUrl={armtAuthUrl ?? ""} /> : <QRContent armtAuthUrl={armtAuthUrl ?? ""} />}
      </Grid>
      <Grid size={{xs: 12, sm: 1}} >
        <Divider orientation={useMediaQuery(theme.breakpoints.down("sm")) ? "horizontal" : "vertical"}>OR</Divider>
      </Grid>
      <Grid size={{xs: 12, sm: 5.5}} textAlign={'left'}>
        <div>
          <Typography variant="h3">Log in with your email</Typography>
          <List sx={{listStyle: 'decimal'}}>
            <ListItem sx={{display: 'list-item'}}>
              Open the RADAR Active RMT App
            </ListItem>
            <ListItem sx={{display: 'list-item'}}>
              Press <strong>Start</strong>
            </ListItem>
            <ListItem sx={{display: 'list-item'}}>
              Press <strong>Enrol</strong>
            </ListItem>
            <ListItem sx={{display: 'list-item'}}>
              Press <strong>Enter Study ID</strong>
            </ListItem>
            <ListItem sx={{display: 'list-item'}}>
              Enter <strong>paprka</strong> in the study ID text box
            </ListItem>
            <ListItem sx={{display: 'list-item'}}>
              Sign in with the email and password you used for this site
            </ListItem>
          </List>
        </div>
      </Grid>
  </React.Fragment>)
}

function MobileContent({armtAuthUrl}: {armtAuthUrl: string}): React.ReactNode {
  return (
    <Box display={'flex'} flexDirection={'column'} gap={2}>
      <Typography variant="h3">On your iPhone now?</Typography>
      <Typography variant="body1">Once the RADAR app is installed, click the following button to log in.</Typography>
      <Button href={armtAuthUrl} variant={"contained"}
              style={{minHeight: 80, borderRadius: 40, minWidth: 180}}>
        <strong>Click to Log In</strong>
      </Button>
      <br />
      <QRContent armtAuthUrl={armtAuthUrl} />
    </Box>
  )
}

function QRContent({armtAuthUrl}: {armtAuthUrl?: string}): React.ReactNode {
  return (
    <Box display={'flex'} flexDirection={'column'} gap={2}>
      {isMobile ? 
        <Typography variant="h3">Otherwise, scan the QR code:</Typography>
        :
        <Typography variant="h3">Scan the QR code</Typography>}
      <Box margin={'auto'} textAlign={'center'}>
          <QRCodeSVG value={armtAuthUrl ?? ''} size={200} />
      </Box>
    </Box>
  )
}

function StepByStepContent(): React.ReactNode {
  return <React.Fragment>
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 5: Continue through the setup</Typography>
          <Typography variant="body1">Continue to click through the setup steps</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
        <Image 
            src={withBasePath('/radar/app/app_setup_registration.png')}
            width={280}
            height={500}
            alt='An image showing the RADAR App registration step'
            style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
          />
        </Grid>


        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3"></Typography>
          <Typography variant="body1"></Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
        <Image 
            src={withBasePath('/radar/app/app_setup_complete.png')}
            width={280}
            height={500}
            alt='An image showing the RADAR App setup complete step'
            style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
          />
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 6: Press the Start button</Typography>
          <Typography variant="body1"></Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
        <Image 
            src={withBasePath('/radar/app/app_homepage.png')}
            width={230}
            height={500}
            alt='An image showing the RADAR App homepage'
            style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
          />
        </Grid>


        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 7: Allow Health Access</Typography>
          <Typography variant="body1"></Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
        <Image 
            src={withBasePath('/radar/app/app_healthkit_scopes_unselected.png')}
            width={230}
            height={500}
            alt='An image showing the RADAR App homepage'
            style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
          />
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3"></Typography>
          <Typography variant="body1"></Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
        <Image 
            src={withBasePath('/radar/app/app_healthkit_scopes.png')}
            width={230}
            height={500}
            alt='An image showing the RADAR App homepage'
            style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
          />
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 8: Press Start</Typography>
          <Typography variant="body1">Press the Start button to begin sharing your data</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
        <Image 
            src={withBasePath('/radar/app/app_healthkit_start.png')}
            width={230}
            height={500}
            alt='An image showing the RADAR App homepage'
            style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
          />
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 9: Press Finish</Typography>
          <Typography variant="body1">Press the Finish button in the bottom right of your screen</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
        <Image 
            src={withBasePath('/radar/app/app_healthkit_collection.png')}
            width={230}
            height={500}
            alt='An image showing the RADAR App homepage'
            style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
          />
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 10: Done</Typography>
          <Typography variant="body1">Once the app has finished, you can continue with this website's tasks. Press the following 'Finish' button to continue</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
        <Image 
            src={withBasePath('/radar/app/app_healthkit_finished.png')}
            width={230}
            height={500}
            alt='An image showing the RADAR App homepage'
            style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
          />
        </Grid>
  </React.Fragment>
}

function StepCompleteContent(): React.ReactNode {
  return (
    <React.Fragment>
      <Grid size={12} textAlign={'left'}>
        <div>
          <Typography variant="h2">Connect to Apple Health</Typography>
          <br />
          <Typography variant="h3">Step 3: Link your data in the app</Typography>
          <Typography variant="body1">
          <p>Please complete the Apple Health task in the RADAR Active RMT app to share your Apple health data with us.</p>
          If you get lost, you can view the step-by-step guide below.
          <p>Once you are done, press the <strong>Complete</strong> button below.</p>
          </Typography>
        </div>
      </Grid>
    <Grid size={12}>
      <Accordion>
        <AccordionSummary
            aria-controls="step-by-step-content"
            id="step-by-step-header"
            expandIcon={<ArrowDropDownIcon />}
          >
          <Typography component="span">Step-by-step guide</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid container spacing={2} gap={2} rowGap={4}>

          <StepByStepContent />
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  </React.Fragment>
)}


interface NextButtonProps {
  disabled: boolean,
  onClick: () => void
}

function NextButton(props: NextButtonProps) {
  let text = "Next"
  return  <Button color="primary" variant="contained" disabled={props.disabled} onClick={props.onClick}>
            {text}
          </Button>
}

interface BackButtonProps {
  exit?: boolean,
  onClick: () => void
}

function BackButton(props: BackButtonProps) {
  let text = props.exit ? "Exit" : "Back"
  return  <Button color="primary" variant="contained" onClick={props.onClick}>
            {text}
          </Button>
}

interface SubmitButtonProps {
  disabled?: boolean
  onClick: () => void
}

function SubmitButton(props: SubmitButtonProps) {
  return  <Button color="primary" variant="contained" disabled={props.disabled} onClick={props.onClick} type={'submit'}>
            Complete
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
  const protocol = useContext(ProtocolContext);
  const studyId = protocol.studyId
  const router = useRouter()
  const pathname = usePathname()
  const [isFetchingToken, setIsFetchingToken] = useState(false)
  const [armtAuthUrl, setArmtAuthUrl] = useState<any>(undefined)
  const [stepIdx, setStepIdx] = useState<number>(0)

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

  const stepContent: React.ReactNode[] = [
    <StepIntroContent />,
    <StepLoginContent armtAuthUrl={armtAuthUrl} />,
    <StepCompleteContent />
  ]
  function nextStep() {
    if ((stepIdx + 1) < stepContent.length) {
      // sendGAEvent('event', 'study_enrolment', {'step': steps[stepIdx + 1], status: 'ongoing'})
      setStepIdx(stepIdx + 1)
    }
  }
  
  function previousStep() {
    if (stepIdx > 0) {
      // sendGAEvent('event', 'study_enrolment', {'step': steps[stepIdx - 1], status: 'ongoing'})
      setStepIdx(stepIdx - 1)
      // scrollToTop()
    } else {
      router.back()
    }
  }
  const ControlButtons = (
    <Box 
      width={"100%"}
      position={'sticky'}
      bottom={0}
      zIndex={1000}>
      <Divider />
      <Box
        paddingTop={4}
        paddingBottom={4}
        display={"flex"}
        alignItems={'center'}
        sx={{ 
          justifyContent: 'space-between', 
          background: 'white'
        }}
        >
        <BackButton exit={false} onClick={previousStep}/>
        <StepperProgress numSteps={3} currentStep={stepIdx} />
        {((stepIdx >= (stepContent.length - 1)) ? 
          <SubmitButton disabled={disabled} onClick={() => router.push('./?success=apple_health')} /> : 
          <NextButton disabled={disabled} onClick={nextStep} />
        )}
      </Box>
    </Box>
  )


  return (
  <Container maxWidth="lg" disableGutters >
    <RadarCard>
      <Container sx={{ pl: 4, pr: 4}}>
        {armtAuthUrl == undefined ? 
          (<GetOauthToken clientId="aRMT" scopes={SCOPES} audience={AUDIENCE} codeFunc={setCode} redirectUri={REDIRECT_URI} />) : 
          (<Box display={'inline'} gap={2} aria-live="polite" paddingLeft={4}>
            <Grid container spacing={2} gap={2} rowGap={4}>
              {stepContent[stepIdx]}
            </Grid>
            <br />
            {ControlButtons}
          </Box>)
        }
      </Container>
    </RadarCard>
  </Container>
  )
}