"use client"
import { Box, Typography } from "@mui/material";
import { ForwardedRef } from "react";
import Image from 'next/image'
import { withBasePath } from "@/app/_lib/util/links";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


export interface ICarouselBlock {
  blockType: 'carousel'
  title?: string
  subtitle?: string
  items: { imgSrc: string, title?: string, content?: string }[]
}

export function CarouselBlock({ title, subtitle, items, ...props }: ICarouselBlock, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <Box display={"flex"} flexDirection={"column"} textAlign={"left"} gap={1}>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="subtitle1">{subtitle}</Typography>
      <Box display={"block"} justifyContent={"center"} textAlign={"center"} alignContent={"center"} alignItems={"center"}>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          navigation={true}
          modules={[Navigation, Autoplay]}
          className="mySwiper"
          autoplay={true}
          breakpointsBase="container"
          breakpoints={{
            400: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            600: {
              slidesPerView: 2,
              spaceBetween: 40
            },
            800: {
              slidesPerView: 3,
              spaceBetween: 40
            }
          }}
          autoHeight={true}
        >
          {items.map((item, idx) => <SwiperSlide style={{ height: 340 }} key={idx}>
            <Box bgcolor={'white'} padding={4} height={280} borderRadius={2} boxShadow={2}>
              <div style={{ height: 190 }}>
                <Image
                  draggable={false}
                  height={180} width={180}
                  src={item.imgSrc}
                  alt={item.title ?? 'image on a carousel'}
                  style={{ borderRadius: 100, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)', marginBottom: 4 }}
                  unoptimized
                />
              </div>
              <Typography variant="h4">{item.title}</Typography>
              <Typography variant="body1">{item.content}</Typography>
            </Box>
          </SwiperSlide>)
          }
        </Swiper>
      </Box>
    </Box>
  )
}