"use client"
import { Box, Typography, useTheme } from "@mui/material";
import { ForwardedRef } from "react";
import { RadarCard } from "../base/card";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from 'next/image'
import { withBasePath } from "@/app/_lib/util/links";
import useMediaQuery from '@mui/material/useMediaQuery';

function CarouselItem(props: {imgSrc: string, title?: string, content?: string}) {
  return  (
    <div style={{userSelect: "none", maxWidth: "260px", minWidth: "200px", padding: 4, height: 340, overflowY: 'clip'}}>
      <RadarCard>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} textAlign={'center'} padding={2} height={300} textOverflow={'clip'}>
          <div style={{height: 190}}>
            <Image 
              draggable={false}
              height={180} width={180}
              src={withBasePath(props.imgSrc)} 
              alt={props.title??'image on a carousel'}
              style={{borderRadius: 100, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)', marginBottom: 4}}
            />
            </div>
          <Typography variant="h4">{props.title}</Typography>
          <Typography variant="body1">{props.content}</Typography>
        </Box>
      </RadarCard>
      </div>
  )
}

export interface ICarouselBlock {
  blockType: 'carousel'
  title?: string
  subtitle?: string
  items: {imgSrc: string, title?: string, content?: string}[]
}

export function CarouselBlock({title, subtitle, items, ...props}: ICarouselBlock, ref: ForwardedRef<HTMLDivElement>) {
  const theme = useTheme()
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1000 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1000, min: 600 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
    }
  }
  return (
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"} gap={1}>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="subtitle1">{subtitle}</Typography>
        <Box display={"block"} justifyContent={"center"}>
        <Carousel responsive={responsive}
          infinite={true}
          keyBoardControl={false}
          draggable={true}
          containerClass="carousel-container"
          centerMode={useMediaQuery(theme.breakpoints.up('sm')) ? true : false} 
        >
          {items.map((item, idx) => <CarouselItem {...item} key={idx}/>)}
        </Carousel>
        </Box>
      </Box>
  )
}