"use client"
import { Box, Button } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import SignaturePad from 'react-signature-pad-wrapper';
import SignatureCanvas from 'react-signature-canvas'

export function SigPad(props: {}) {
  const signCanvas = React.useRef() as React.MutableRefObject<any>;

  return (
    <Box display={'flex'} flexDirection={'column'} width={"100%"}
        border={"1px solid #e8e8e8"}>
      {/* <Box overflow={"clip"} height={200} width={1130}> */}
      <SignatureCanvas 
        clearOnResize={true}
        ref={signCanvas}
        canvasProps={{
          className: 'm-signature-pad',
        }} 
      />  
      {/* </Box> */}
      <Button onClick={()=>{signCanvas.current.clear();}} fullWidth={false}>Clear</Button>
    </Box>)
}