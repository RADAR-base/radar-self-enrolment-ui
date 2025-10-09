"use client"
import { Button, Box, Typography, Grow, Backdrop } from "@mui/material";
import React from "react";
import { MarkdownContainer } from "../base/markdown";

export function FinishBanner(props: {title: string, content: string}) {
  const [open, setOpen] = React.useState(true);
  const handleReturn = () => {
    setOpen(false)
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
            {props.title}
          </Typography>
          <MarkdownContainer>
            {props.content}
          </MarkdownContainer>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} marginTop={2} gap={1}> 
            <Button onClick={handleReturn} variant="outlined">Close</Button>
          </Box>
        </Box>
      </Grow>
    </Backdrop>
  )
}