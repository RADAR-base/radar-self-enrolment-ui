"use client"
import { Button, Modal, Box, Typography, Grow } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

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
    <Grow in={open}>
      <Box sx={{
        zIndex: 1000,
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
          {`You have successfully linked your ${props.device}.\n\nWould you like to link another device?`}
        </Typography>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} marginTop={2} gap={1}> 
          <Button onClick={handleReturn} variant="outlined">No</Button>
          <Button onClick={handleAddMore} variant="outlined">Yes</Button>
        </Box>
      </Box>
    </Grow>
  )
}