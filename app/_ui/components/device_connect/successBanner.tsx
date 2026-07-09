"use client"
import { Button, Modal, Box, Typography, Grow, Backdrop, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { ConnectDeviceConfirmation } from "@/app/_lib/study/protocol";

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

export function GoogleHealthConnectedBanner(props: {confirmation: ConnectDeviceConfirmation, onFinish?: () => {}}) {
  const [open, setOpen] = React.useState(true);
  const router = useRouter()
  const { confirmation } = props
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

          {confirmation.whatHappensNext && (
            <>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>What happens next?</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{confirmation.whatHappensNext}</Typography>
            </>
          )}

          {confirmation.dataSharedItems && confirmation.dataSharedItems.length > 0 && (
            <>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>Data currently being shared</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                As agreed in the consent step, researchers have read-only access to your:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 1, mb: 0 }}>
                {confirmation.dataSharedItems.map((item, i) => (
                  <Typography component="li" variant="body2" key={i}>
                    {item.label && <strong>{item.label}{item.description ? ': ' : ''}</strong>}{item.description}
                  </Typography>
                ))}
              </Box>
            </>
          )}

          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>Managing your connection</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Participation is entirely voluntary. If you wish to withdraw from the study or disconnect your Google Health account, please contact the study administration team at{' '}
            <Link href={`mailto:${confirmation.adminEmail}`}>{confirmation.adminEmail}</Link>.
          </Typography>

          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3 }}>Learn more about our work</Typography>
          <Box component="ul" sx={{ pl: 3, mt: 1, mb: 0 }}>
            <Typography component="li" variant="body2">
              <Link href={confirmation.privacyPolicyUrl} target="_blank" rel="noopener noreferrer">How we handle your data (Google Privacy Policy)</Link>
            </Typography>
            <Typography component="li" variant="body2">
              <Link href={confirmation.publicationsUrl} target="_blank" rel="noopener noreferrer">View our peer-reviewed research publications</Link>
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