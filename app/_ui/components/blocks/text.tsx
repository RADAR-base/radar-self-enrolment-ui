import { Box, Typography } from "@mui/material";
import { ForwardedRef } from "react";

export interface ITextBlock {
  blockType: 'text'
  title?: string
  subtitle?: string
  content: string
}

export function TextBlock({title, subtitle, content, ...props}: ITextBlock, ref: ForwardedRef<HTMLDivElement>) {
  return (
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"}>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="subtitle1">{subtitle}</Typography>
        <Typography variant="body1" sx={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{content}</Typography>
      </Box>
  )
}