import { withBasePath } from "@/app/_lib/util/links";
import { Box, Container, Typography } from "@mui/material";
import { ForwardedRef } from "react";

function isVideoFile(video: VideoFile | VideoYoutube): video is VideoFile {
  return 'src' in video;
}

function isVideoYoutube(video: VideoFile | VideoYoutube): video is VideoYoutube {
  return 'youtubeId' in video;
}

function DirectVideoComponent({video}: {video: VideoFile}) {
  return <video width={video.width} height={video.height} {...video.params}>
            <source src={withBasePath(video.src)} type={video.type}></source>
          </video>
}

function YoutubeVideoComponent({video}: {video: VideoYoutube}) {
  return (
    <div style={{position: 'relative', overflow: 'hidden', width: '100%', paddingTop: '56.25%'}}>
      <iframe width='100%' height='100%' style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, width: '100%', height: '100%'}}
              src={"https://www.youtube-nocookie.com/embed/" + video.youtubeId} 
              title="Video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" 
              referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>  
      </iframe>
    </div>
  )
}

interface VideoFile {
    src: string,
    type: string,
    width?: number | string,
    height?: number | string
    params?: {[key: string]: string}
}

interface VideoYoutube {
  youtubeId: string
}

export interface IVideoBlock {
  blockType: 'video'
  title?: string
  subtitle?: string
  video: VideoFile | VideoYoutube
}

export function VideoBlock({title, subtitle, video}: IVideoBlock) {
  return (
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"} gap={1}>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="subtitle1">{subtitle}</Typography>
        {isVideoFile(video) ? <DirectVideoComponent video={video} /> : <YoutubeVideoComponent video={video}/>}
      </Box>
  )
}