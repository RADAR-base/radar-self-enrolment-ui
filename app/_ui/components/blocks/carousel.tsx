"use client"
import { Box, Link, Typography } from "@mui/material";
import { ForwardedRef } from "react";
import Image from 'next/image'
import { withBasePath } from "@/app/_lib/util/links";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useRouter } from "next/navigation";


export interface ICarouselBlock {
  blockType: 'carousel'
  title?: string
  subtitle?: string
  items: { imgSrc: string, title?: string, content?: string, href?: string}[]
}

export function CarouselBlock({ title, subtitle, items, blockType }: ICarouselBlock) {
  const router = useRouter()
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
          navigation={false}
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
            <Link target="_blank" href={item.href} underline="none">
              <Box bgcolor={'white'} height={280} borderRadius={2} p={2}
                  boxShadow={2} style={{cursor: 'pointer'}}
                  >
                <div style={{ height: 200 }}>
                  <Image
                    unoptimized
                    draggable={false}
                    height={180}
                    width={180}
                    src={withBasePath(item.imgSrc)}
                    alt={item.title ?? 'image on a carousel'}
                    style={{ 
                      borderRadius: 100, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)',
                      marginBottom: 4, objectFit: 'cover'}
                    }
                  />
                </div>
                <Typography variant="h4" sx={{textDecoration: 'none'}}>{item.title}</Typography>
                <Typography variant="body1" sx={{textDecoration: 'none'}}>{item.content}</Typography>
              </Box>
            </Link>
          </SwiperSlide>)
          }
        </Swiper>
      </Box>
    </Box>
  )
}