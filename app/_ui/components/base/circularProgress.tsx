import { Box, CircularProgress, CircularProgressProps, Typography } from "@mui/material";

export function CircularProgressWithLabel(props: CircularProgressProps & { children: React.ReactNode}) {
  return (
    <Box display='inline-flex' style={{position: 'relative'}} justifyContent={'center'} justifyItems={'center'} alignContent={'center'} alignItems={'center'}>
      <CircularProgress variant='determinate' {...props} sx={{zIndex: 100}}></CircularProgress>
      <Box style={{position: "absolute"}}>
        {props.children}
      </Box>
    </Box>
  );
};