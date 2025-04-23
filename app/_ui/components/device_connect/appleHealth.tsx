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
      <Grid size={12} textAlign={'left'}>
        <Typography variant="h2">Connect your iPhone or iPhone and Apple Watch</Typography>
        <Typography paddingTop={2}  variant="body1">
        To allow us to access your physical activity information from your 
        iPhone you will need to download the study app, we will tell you how 
        to do this in 3 easy steps.
        <strong> Please read each of the 3 steps before you start.</strong> 
        </Typography>
        <Typography paddingTop={2}  variant="h3">Step 1: Download the study app</Typography>
        <Typography  variant="body1">
          The study app is called RADAR active RMT.
          <br />
          <strong>To download the study app, you will need your iPhone. </strong>
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }} textAlign={'left'}>
        <Typography variant="body1">
            If <strong>you are</strong> logged into the study website on your phone
            <div>
              <ul>
                <li>Press app store icon to take you to the study app </li>

                <li>Press Get next to RADAR active RMT app</li>

                <li>Press Open</li>
              </ul>
            </div>
            You should now see the study app ‘Welcome page’. 
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }} alignContent={'center'}>
        <AppStoreDownloadModalContent />
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }} textAlign={'left'}>
        <Typography variant="body1">
          If you <strong>are not</strong> logged into the study website on your phone  
          <div>
            <ul>
              <li>From your phone, go to the app store. </li>
              <li>Search for RADAR active RMT. It looks like this</li>
            </ul>
          </div>
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }} alignContent={'center'}>
        <Image
          src={withBasePath('/radar/app_store_armt.png')}
          width={254}
          height={291}
          alt={"RADAR Active RMT app in app store"}
          style={{ borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)', alignSelf: 'center' }}
        />
      </Grid>

    </React.Fragment>
)}

interface StepLoginContentProps {
  armtAuthUrl?: string
}

function StepLoginContent({armtAuthUrl}: StepLoginContentProps): React.ReactNode {
  const protocol = useContext(ProtocolContext)
  const theme = useTheme()
  return (
    <React.Fragment>
      <Grid size={12} textAlign={'left'}>
        <div>
          <Typography variant="h2">Connect your iPhone or iPhone and Apple Watch</Typography>
          <br />
          <Typography variant="h3">Step 2: Chose a way of logging into the study app</Typography>
          <Typography variant="body1">
          You can log in to the study app in 2 ways:
          </Typography>
        </div>
      </Grid>
      <Grid size={{xs: 12, sm: 5.5}} textAlign={'left'} >
        <QRContent armtAuthUrl={armtAuthUrl ?? ""} />
      </Grid>
      <Grid size={{xs: 12, sm: 1}} >
        <Divider orientation={useMediaQuery(theme.breakpoints.down("sm")) ? "horizontal" : "vertical"}>OR</Divider>
      </Grid>
      <Grid size={{xs: 12, sm: 5.5}} textAlign={'left'}>
        <div>
          <Typography variant="h3">Or typing into the app</Typography>
          <List sx={{listStyle: 'decimal'}}>
            <ListItem sx={{display: 'list-item'}}>
              <Typography>Study name:
                <Button color="inherit" variant="text" endIcon={<ContentCopyIcon />}
                        onClick={() =>navigator.clipboard.writeText(protocol.studyId)}
                        sx={{userSelect: 'text'}}
                        >
                    <Typography>{protocol.studyId}</Typography>
                </Button>
                </Typography>
            </ListItem>
            <ListItem sx={{display: 'list-item'}}>
              <Typography>The <strong>email address</strong> you used to set up your study account.</Typography>
            </ListItem>
            <ListItem sx={{display: 'list-item'}}>
              <Typography>The <strong>password</strong> you used to set up your study account.</Typography>
            </ListItem>
          </List>
        </div>
      </Grid>
  </React.Fragment>)
}

function QRContent({armtAuthUrl}: {armtAuthUrl?: string}): React.ReactNode {
  return (
    <Box display={'flex'} flexDirection={'column'} gap={2}>
      <Typography variant="h3">Scanning this QR code</Typography>
      <Box margin={'auto'} textAlign={'center'}>
          <QRCodeSVG value={armtAuthUrl ?? ''} size={200} />
      </Box>
      <Typography variant="body1" fontStyle={'italic'}>To use the QR code you must be looking at it on a computer screen/iPad, scan the code using your phone.</Typography>
    </Box>
  )
}

function StepByStepContent(): React.ReactNode {
  const protocol = useContext(ProtocolContext);

  return <React.Fragment>
        <Grid size={12} textAlign={'left'}>
          <Typography variant="body1">1. Press <strong>Start</strong></Typography>
        </Grid>
        <Grid size={12} textAlign={'left'}>
          <Typography variant="body1">2. Press <strong>Enrol</strong></Typography>
        </Grid>
        <Grid size={12} textAlign={'left'}>
          <Typography variant="body1">3. <strong>Scan QR code</strong> or Press <strong>Enter Study ID</strong></Typography>
          <Typography variant="body1">
            <em>If scanning QR code:</em>
            <br />
            Press scan, enable camera and scan the code.
            <br />
            Press login.
          </Typography>
          <Typography variant="body1" paddingTop={2}>
          <em>If entering Study ID:</em>
          <br />
          Enter 
            <Button color="inherit" variant="text" endIcon={<ContentCopyIcon />}
                        onClick={() =>navigator.clipboard.writeText(protocol.studyId)}
                        sx={{userSelect: 'text'}}>
              <Typography>
                {protocol.studyId}
              </Typography>
            </Button>
            <br />
            Press login.
            <br />
            Enter your email and password you used for the study site </Typography>
        </Grid>
        <Grid size={12} textAlign={'left'}>
          <Typography variant="body1">4. Press <strong>Next</strong> - on Registration page</Typography>
        </Grid>
        <Grid size={12} textAlign={'left'}>
          <Typography variant="body1">5. Press <strong>Start</strong> on Registration Complete page</Typography>
        </Grid>
        <Grid size={12} textAlign={'left'}>
          <Typography variant="body1">6. Press <strong>Start</strong> on Today page</Typography>
        </Grid>
        <Grid size={12} textAlign={'left'}>
          <Typography variant="body1">7. Press <strong>turn on all</strong> or click all the boxes <strong>but</strong> blood glucose, resting energy, sleep and weight.</Typography>
        </Grid>
        <Grid size={12} textAlign={'left'}>
          <Typography variant="body1">8. Press <strong>allow</strong> in upper right corner.</Typography>
        </Grid>
        <Grid size={12} textAlign={'left'}>
          <Typography variant="body1">9. Press <strong>Begin</strong> on HealthKit page.</Typography>
        </Grid>
        <Grid size={12} textAlign={'left'}>
          <Typography variant="body1">10. Press <strong>finish</strong>, wait to see the <strong>Done</strong> button and press it.</Typography>
        </Grid>
        <Grid size={12} textAlign={'left'}>
          <Typography variant="body1">11. Press <strong>back to study</strong> to return to the study website.</Typography>
        </Grid>
  </React.Fragment>
}

function StepCompleteContent(): React.ReactNode {
  return (
    <React.Fragment>
      <Grid size={12} textAlign={'left'}>
        <div>
          <Typography variant="h2">Connect your iPhone or iPhone and Apple Watch</Typography>
          <br />
          <Typography variant="h3">Step 3: How to log into the study app</Typography>
          <Typography variant="body1">From the study app ‘Welcome page’</Typography>
        </div>
      </Grid>
      <StepByStepContent />
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
  const [armtAuthUrl, setArmtAuthUrl] = useState<any>()
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
        padding={4}
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
          </Box>)
        }
      </Container>
      {ControlButtons}
    </RadarCard>
  </Container>
  )
}