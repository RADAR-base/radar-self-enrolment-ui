"use client"
import { Button, Modal, Box, Typography, Grow, Backdrop } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { type JSX } from "react";

interface TaskConfirmDialogProps {
  open: boolean,
  onConfirm: () => void,
  onReject: () => void,
  title?: string,
  children?: JSX.Element,
  confirmText?: string
  rejectText?: string
}

export function TaskConfirmDialog(props: TaskConfirmDialogProps) {
  if (!props.open) return null;
    return (
      // <Backdrop
      //   sx={(theme: any) => ({ zIndex: theme.zIndex.drawer + 1 })}
      //   open={props.open}
      //   onClick={props.onReject}
      // >
      // </Backdrop>
      <Modal open={props.open} onClose={props.onReject}>
        <Box sx={{
          position: 'absolute',
          marginInline: 'auto',
          left: 0,
          right: 0,
          top: '30%',
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
          {props.children}
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} marginTop={2} gap={1}> 
            <Button onClick={props.onReject} variant="outlined">{props.rejectText ?? 'No'}</Button>
            <Button onClick={props.onConfirm} type='submit' variant="outlined">{props.confirmText ?? 'Yes'}</Button>
          </Box>
        </Box>
      </Modal>
    );
}