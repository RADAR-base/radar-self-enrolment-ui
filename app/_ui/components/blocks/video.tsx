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

export function VideoBlock(props: IVideoBlock, ref: ForwardedRef<HTMLDivElement>) {
  return (
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"}>
        <Typography variant="h2">{props.title}</Typography>
        <Typography variant="subtitle1">{props.subtitle}</Typography>
        <Container>
          <video width={props.video.width} height={props.video.height} {...props.video.params} autoPlay>
            <source src={withBasePath(props.video.src)} type={props.video.type}></source>
          </video>
        </Container>
      </Box>
  )
}