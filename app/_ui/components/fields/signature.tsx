import { Box, Button, FormControl, Modal, TextField, Typography } from "@mui/material";
import { ChangeEvent, ForwardedRef, useEffect } from "react";
import { ISignatureItem } from "../../../_lib/armt/definition/field.interfaces";
import SignatureCanvas from 'react-signature-canvas'
import React from "react";

interface ArmtSignatureFieldProps extends ISignatureItem {
  setFieldValue: (id: string, value?: string) => void
  value?: string,
  disabled?: boolean,
  key?: string,
  color? : 'primary' | 'secondary' | 'standard' | 'error' | 'info' | 'success' | 'warning'
}

export function ArmtSignatureField({label, description, errorText, ...props}: ArmtSignatureFieldProps, ref: ForwardedRef<HTMLDivElement>) {
  const signCanvas = React.useRef<SignatureCanvas>(null) 
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const clearCanvas = () => {signCanvas.current?.clear()}
  const saveCanvas = () => {
    const imgStr = signCanvas.current?.getTrimmedCanvas().toDataURL()
    props.setFieldValue(props.id, imgStr)
    handleClose()
  }
  const sigBlock =  (
    <Box sx={{mt: 2, border: '1px solid #999', borderRadius: 2}}>
      <SignatureCanvas      
              clearOnResize={true}
              ref={signCanvas}
              canvasProps={{className: 'm-signature-pad'}}
              
              />
    </Box>
  )
  const sigImg = (
    <Box sx={{padding: 2}}>
      <img
        src={props.value}
        alt="signature"
        style={{
          display: "block",
          margin: "0 auto",
          border: "1px solid 444",
          maxWidth: "600",
          maxHeight: "200"
        }}
      />
    </Box>
  )
  
  return (
    <FormControl>
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"} marginTop={1} alignItems={'center'}>
        <Typography variant="h4" component={'span'}>{props.title}</Typography>
        <Typography variant="body1" component={'span'} >{description}</Typography>
        {props.value ? (sigImg) : null}
          <div>
            <Button onClick={handleOpen} variant='contained'>Click to sign</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: 800,
                bgcolor: 'background.paper',
                borderRadius: 2,
                // border: '2px solid #000',
                boxShadow: 24,
                pl: {sm: 4, xs: 1},
                pr: {sm: 4, xs: 1},
                p: 4}}
                >
                <Typography id="modal-modal-title" variant="h3">
                  Sign here
                </Typography>
                {sigBlock}
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} paddingTop={2}> 
                  <Button onClick={handleClose}>Back</Button>
                  <Button onClick={clearCanvas}>Clear</Button>
                  <Button onClick={saveCanvas}>Save</Button>
                </Box>
              </Box>
            </Modal>
          </div>
      </Box>
    </FormControl>
  )
}