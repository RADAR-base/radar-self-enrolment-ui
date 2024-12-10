"use client"
import { Button, Modal, Box, Typography, Grow } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { acceptOrRejectCookies } from "./actions";


export function CookieBanner() {
  const [open, setOpen] = React.useState(true);
  const router = useRouter()
  const handleAll = () => {
    acceptOrRejectCookies("all")
    setOpen(false)
  }
  const handleFunctional = () => {
    acceptOrRejectCookies("functional")
    setOpen(false)
  }
  const handleReject = () => {
    acceptOrRejectCookies("reject")
    setOpen(false)
  }
  return (
    <Grow in={open}>
    <Box sx={{
      zIndex: 1000,
      position: 'fixed',
      bottom: {sm: '5%', xs: '0'},
      left: {sm: '5%', xs: '0'},
      right: {sm: '5%', xs: '0'},
      // transform: 'translate(-50%, -50%)',
      minWidth: 300,
      maxWidth: 600,
      bgcolor: 'background.paper',
      borderRadius: 2,
      // border: '2px solid #000',
      boxShadow: 16,
      p: 4}}>
      <Typography id="modal-modal-title" variant="h3">
        Cookie consent
      </Typography>
      <Typography sx={{ mt: 2 }}>
        {"We use functional cookies to keep you logged in between visits.\nIf you accept all cookies we will also use analytic cookies, which we use to help us understand how people interact with the study."}
      </Typography>
      
      <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} marginTop={2} gap={1}> 
        <Button onClick={handleReject} variant="outlined">Reject All</Button>
        <Button onClick={handleFunctional} variant="outlined">Functional Only</Button>
        <Button onClick={handleAll} variant="outlined">Accept All</Button>
      </Box>
    </Box>
    </Grow>
  )
}
