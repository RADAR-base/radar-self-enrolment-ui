import { Box, Button, FormControl, Modal, TextField, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import TextFieldsIcon from '@mui/icons-material/TextFields';
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
  const [isTypeEntrySignature, setIsTypeEntrySignature] = React.useState<boolean>(false)
  const [typedSignature, setTypedSignature] = React.useState<string>("")

  const canvasIsBlank = () => {
    const canvas = signCanvas.current?.getCanvas()
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        return ctx.getImageData(0, 0, canvas.width, canvas.height).data.some(channel => channel !== 0);
      }
    }
    return true
  }

  const handleOpen = () => {setIsTypeEntrySignature(false); clear(); setOpen(true)};
  const handleClose = () => setOpen(false);
  const clearCanvas = () => {signCanvas.current?.clear()}

  const clear = () => {clearCanvas(); setTypedSignature("")}

  const drawText = () => {
    signCanvas.current?.clear()
    const canvas = signCanvas.current?.getCanvas()
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.textAlign = "center"
        ctx.font = "50px Cursive"
        ctx.fillText(typedSignature, canvas.width*0.5,canvas.height*0.5, 500)
      }
    }
  }

  const saveCanvas = () => {
    const imgStr = signCanvas.current?.getTrimmedCanvas().toDataURL()
    props.setFieldValue(props.id, imgStr)
    handleClose()
  }

  const save = () => {
    if (isTypeEntrySignature) {
      clearCanvas()
      drawText()
    }
    saveCanvas()
  }


  const sigBlock =  (
    <Box sx={{mt: 1, border: '1px solid #999', borderRadius: 2, display: isTypeEntrySignature ? 'none' : 'block'}}>
      <SignatureCanvas      
              clearOnResize={true}
              ref={signCanvas}
              canvasProps={{className: 'm-signature-pad'}}
              />
    </Box>
  )
  const sigImg = (
      <img
        src={props.value}
        alt="signature"
        style={{
          display: "block",
          margin: "0 auto",
          border: "1px solid 444",
          maxWidth: 600,
          maxHeight: 200,
          justifySelf: 'left'
        }}
      />
  )

  const typeBlock = (
    <Box display='flex' sx={{mt: 1, border: '1px solid #999', borderRadius: 2, display: isTypeEntrySignature ? 'block' : 'none'}} alignContent={'center'} justifyItems={'center'}>
      <TextField fullWidth slotProps={{htmlInput: {sx: {fontSize: 50, fontFamily: "cursive"}}}} value={typedSignature} onChange={(e) => setTypedSignature(e.target.value)} />
    </Box>
  )
  
  return (
    <FormControl>
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"} marginTop={1} alignItems={'flex-start'} gap={1}>
        <Typography variant="h4" component={'span'}>{props.title}</Typography>
        <Typography variant="body1" component={'span'} >{description}</Typography>
        <Box display='flex' sx={{ border: '1px solid #999', borderRadius: 2, width: 800, minHeight: 200}} alignItems={'center'} justifyItems={'center'}>
          {props.value ? (sigImg) : null}
        </Box>
        <div>
          <Button onClick={handleOpen} variant='outlined'>Click to sign</Button>
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
              Please draw or type your signature in the box below and press the Save button.
              <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} paddingTop={1} gap={2}> 
                <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} gap={2}> 
                  <Button startIcon={<EditIcon />} variant={isTypeEntrySignature ? 'text' : 'contained'} onClick={() => setIsTypeEntrySignature(false)}>
                    Draw Signature
                  </Button>
                  <Button startIcon={<TextFieldsIcon />}  variant={isTypeEntrySignature ? 'contained' : 'text'} onClick={() => setIsTypeEntrySignature(true)}>
                    Type Signature
                  </Button>
                </Box>
                <Button onClick={clear}>Clear</Button>

              </Box>
              {sigBlock}
              {typeBlock}
              <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} paddingTop={1}> 
                <Button onClick={handleClose}>Back</Button>
                <Button onClick={save}>Save</Button>
              </Box>
            </Box>
          </Modal>
        </div>
      </Box>
    </FormControl>
  )
}