"use client"
import { Button, Modal, Box, Typography, Grow, Backdrop, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const GOOGLE_PRIVACY_POLICY_URL = 'https://radar-base.org/google-privacy-policy/'
const RADAR_PUBLICATIONS_URL = 'https://radar-base.org/publications/'
const STUDY_ADMIN_EMAIL = 'radar-base@kcl.ac.uk'

export function DeviceConnectedBanner(props: {device: string, onFinish?: () => {}}) {
  const [open, setOpen] = React.useState(true);
  const router = useRouter()
  const handleAddMore = () => {
    setOpen(false)
    router.replace(window.location.href.split('?')[0])
  }
  const handleReturn = () => {
    setOpen(false)
    if (props.onFinish) {
      props.onFinish()
    } else {
      router.push('./')
    }
  }
  return (
    <Backdrop
      sx={(theme: any) => ({ zIndex: theme.zIndex.drawer + 1 })}
      open={open}
    >
      <Grow in={open}>
        <Box sx={{
          position: 'absolute',
          marginInline: 'auto',
          left: 0,
          right: 0,
          top: '30%',
          transform: 'translate(-50%, -50%)',
          minWidth: 300,
          maxWidth: 600,
          bgcolor: 'background.paper',
          borderRadius: 2,
          // border: '2px solid #000',
          boxShadow: 16,
          p: 4}}>
          <Typography id="modal-modal-title" variant="h3">
            Thank you: {props.device} Connected
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {`You have successfully linked your ${props.device}.\n\nAre you done, or would you like to link another device?`}
          </Typography>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} marginTop={2} gap={1}>
            <Button onClick={handleAddMore} variant="outlined">Link another device</Button>
            <Button onClick={handleReturn} variant="outlined">Done</Button>
          </Box>
        </Box>
      </Grow>
    </Backdrop>
  )
}

// A richer confirmation shown only for Google Health
export function GoogleHealthConnectedBanner(props: {onFinish?: () => {}}) {
  const [open, setOpen] = React.useState(true);
  const router = useRouter()
  const handleAddMore = () => {
    setOpen(false)
    router.replace(window.location.href.split('?')[0])
  }
  const handleReturn = () => {
    setOpen(false)
    if (props.onFinish) {
      props.onFinish()
    } else {
      router.push('./')
    }
  }
  return (
    <Backdrop
      sx={(theme: any) => ({ zIndex: theme.zIndex.drawer + 1 })}
      open={open}
    >
      <Grow in={open}>
        <Box sx={{
          position: 'relative',
          width: '90%',
          maxWidth: 640,
          maxHeight: '85vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 16,
          p: 4,
          textAlign: 'left',
        }}>
          <Typography variant="h3">Google Health Successfully Connected</Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Thank you for authorizing your account. Your health and fitness data is now being securely transmitted to the RADAR-base research platform.
          </Typography>

          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>What happens next?</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            To maintain the scientific integrity of this study and prevent bias, this portal does not display your collected health data. Your information is securely routed directly to our clinical research team for analysis.
          </Typography>

          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>Data currently being shared</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            As agreed in the consent step, researchers have read-only access to your:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mt: 1, mb: 0 }}>
            <Typography component="li" variant="body2"><strong>Activity &amp; Fitness:</strong> Steps, total calories, and exercise sessions.</Typography>
            <Typography component="li" variant="body2"><strong>Health Metrics:</strong> Heart rate, HRV, blood oxygen (oxy-heart-rate), sleep respiratory rate, and sleep temperature derivations.</Typography>
            <Typography component="li" variant="body2"><strong>Sleep:</strong> Sleep stages and classic sleep data.</Typography>
            <Typography component="li" variant="body2"><strong>Heart Health:</strong> Electrocardiogram (raw waveform) and irregular rhythm notifications (AFib).</Typography>
            <Typography component="li" variant="body2"><strong>Location:</strong> GPS trackpoints (collected only during active exercise).</Typography>
            <Typography component="li" variant="body2"><strong>Settings:</strong> Timezone information (to accurately align your daily data).</Typography>
          </Box>

          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>Managing your connection</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Participation is entirely voluntary. If you wish to withdraw from the study or disconnect your Google Health account, please contact the study administration team at{' '}
            <Link href={`mailto:${STUDY_ADMIN_EMAIL}`}>{STUDY_ADMIN_EMAIL}</Link>.
          </Typography>

          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>Learn more about our work</Typography>
          <Box component="ul" sx={{ pl: 3, mt: 1, mb: 0 }}>
            <Typography component="li" variant="body2">
              <Link href={GOOGLE_PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">How we handle your data (Google Privacy Policy)</Link>
            </Typography>
            <Typography component="li" variant="body2">
              <Link href={RADAR_PUBLICATIONS_URL} target="_blank" rel="noopener noreferrer">View our peer-reviewed research publications</Link>
            </Typography>
          </Box>

          <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} marginTop={3} gap={1}>
            <Button onClick={handleAddMore} variant="outlined">Link another device</Button>
            <Button onClick={handleReturn} variant="contained">Done</Button>
          </Box>
        </Box>
      </Grow>
    </Backdrop>
  )
}