import { Box, Typography } from "@mui/material"


interface ErrorComponentProps {
  title: string
  message: string
}

export function ErrorComponent(props: ErrorComponentProps) {
  return <Box>
    <Typography variant="h3" color="error">Error: {props.title}</Typography>
    <Typography variant="body1">{props.message}</Typography>

  </Box>
}