import { withBasePath } from "@/app/_lib/util/links";
import { Box, Container, Typography } from "@mui/material";
import { ForwardedRef } from "react";


function DirectVideoComponent() {

}


export interface IVideoBlock {
  blockType: 'video'
  title?: string
  subtitle?: string
  video: {
    src: string,
    type: string,
    width?: number | string,
    height?: number | string
    params?: {[key: string]: string}
  }
}

export function VideoBlock({title, subtitle, video}: IVideoBlock) {
  return (
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"} gap={1}>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="subtitle1">{subtitle}</Typography>
        <Box>
          <video width={video.width} height={video.height} {...video.params}>
            <source src={withBasePath(video.src)} type={video.type}></source>
          </video>
        </Box>
      </Box>
  )
}