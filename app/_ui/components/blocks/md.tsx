import { Box, Typography } from "@mui/material";
import { ForwardedRef } from "react";
import { MarkdownContainer } from "@/app/_ui/components/base/markdown";

export interface IMarkdownBlock {
  blockType: 'markdown'
  title?: string
  subtitle?: string
  content: string
}

export function MarkdownBlock({title, subtitle, content, ...props}: IMarkdownBlock, ref: ForwardedRef<HTMLDivElement>) {
  return (
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"} gap={1}>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="subtitle1" sx={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{subtitle}</Typography>
        <MarkdownContainer>{content}</MarkdownContainer>       
      </Box>
  )
}