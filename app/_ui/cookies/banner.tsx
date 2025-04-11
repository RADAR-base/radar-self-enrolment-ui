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
          maxWidth: 600,
          bgcolor: 'background.paper',
          borderRadius: 2,
          // border: '2px solid #000',
          boxShadow: 16,
          p: 4
        }}>
          <Typography id="modal-modal-title" variant="h3">
            Cookie consent
          </Typography>
          <Typography sx={{ mt: 2, mb: 1 }}>
            {"We use functional cookies to keep you logged in between visits.\nIf you accept all cookies we will also use analytic cookies, which we use to help us understand how people interact with the study."}
          </Typography>
          <Typography>
            For more information, view our <NextLink href={cookiePolicyLink}>cookie policy</NextLink>.
          </Typography>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} marginTop={2} gap={1}>
            <Button onClick={handleReject} variant="outlined">Reject All</Button>
            <Button onClick={handleFunctional} variant="outlined">Functional Only</Button>
            <Button onClick={handleAll} variant="outlined">Accept All</Button>
          </Box>
        </Box>
      </Grow>
    </Backdrop>
  )
}
