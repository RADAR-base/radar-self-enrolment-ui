"use client"
import { Button, Modal, Box, Typography, Grow, Backdrop } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { acceptOrRejectCookies } from "./actions";
import NextLink from 'next/link'
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client";


export function CookieBanner() {
  const [open, setOpen] = React.useState(true);
  const studyProtocol = useContext(ProtocolContext)
  const router = useRouter()
  const cookiePolicyLink = studyProtocol ? `/${studyProtocol.studyId}/cookies` : '/cookies'
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
    <Backdrop 
      open={open}
      sx={(theme: any) => ({ zIndex: theme.zIndex.drawer + 1 })}
    >
      <Grow in={open}>
        <Box sx={{
          zIndex: 10500,
          position: 'fixed',
          bottom: { sm: '5%', xs: '0' },
          left: { sm: '5%', xs: '0' },
          right: { sm: '5%', xs: '0' },
          // transform: 'translate(-50%, -50%)',
          minWidth: 300,
          maxWidth: 800,
          bgcolor: 'background.paper',
          borderRadius: {xs: 0, sm: 2},
          // border: '2px solid #000',
          boxShadow: 16,
          p: 4
        }}>
          <Typography id="modal-modal-title" variant="h3">
            Cookie consent
          </Typography>
          <Typography sx={{ mt: 2, mb: 1 }}>
            {"Cookies are files saved on our phone, tablet or computer when a person visits a website. As a key part of our research, we are using cookies to help us understand people’s experience of using the website.\n"}
          </Typography>
          <Typography sx={{ mt: 2, mb: 1 }}>

            {"By clicking ‘Accept All’, we will be able to study how people use the website. We hope this will help us improve how research is done in the future.\n"}   
            {"By clicking ‘Essential Only’, the website will remember your account details allowing you to log in easily. It will not allow us to study how you use the website\n"}
          </Typography>
          <Typography>
            For more information, view our <NextLink href={cookiePolicyLink}>cookie statement</NextLink>.
          </Typography>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} marginTop={2} gap={1}>
            <Button onClick={handleReject} variant="outlined">Essential Only</Button>
            <Button onClick={handleAll} variant="outlined">Accept All</Button>
          </Box>
        </Box>
      </Grow>
    </Backdrop>
  )
}
