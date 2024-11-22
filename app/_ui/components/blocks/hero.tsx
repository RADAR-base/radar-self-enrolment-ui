"use client"
import { withBasePath } from "@/app/_lib/util/links";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { ForwardedRef } from "react";

interface ICallToAction {
  text: string
  href?: string
  onClick?: () => void
}

interface IHeroImage {
  src: string,
  altText: string
}


function CTAButton(cta: ICallToAction) {
  return <Button variant="contained" 
                 href={cta.href}
                 onClick={cta.onClick}
                 sx={{ width: { xs: "auto", sm: "auto" } }}>
          {cta.text}
        </Button>
}

function CTAButtons(cta?: ICallToAction, cta2?: ICallToAction) {

  const cta1Button = cta ? CTAButton(cta) : undefined
  const cta2Button = cta2 ? CTAButton(cta2) : undefined
  return <Box display={"flex"}  flexShrink={0} gap={2} flexDirection={{xs: 'column', sm: 'row'}}>{cta1Button}{cta2Button}</Box>
}

export interface IHeroBlock {
  blockType: 'hero'
  title?: string
  subtitle?: string
  heroImage?: IHeroImage
  cta?: ICallToAction
  cta2?: ICallToAction
}

export function HeroBlock(props: IHeroBlock, ref: ForwardedRef<HTMLDivElement>) {
  const flex = props.heroImage ? 0.6 : 1.2
  return (
    <Box 
      display={"flex"} 
      flexDirection={{xs: "column-reverse", sm: "row"}}
      minHeight={"40vh"}
    >
      <Box display={"flex"} flexDirection={"column"} textAlign={{xs: "center", sm: "left"}} flexShrink={1} flex={flex} padding={2} margin="auto" gap={1}>
        <Typography variant="h1">{props.title}</Typography>
        <Typography variant="subtitle1">{props.subtitle}</Typography>
        {CTAButtons(props.cta, props.cta2)}
      </Box>
      <Box flex={1}>
        {props.heroImage && 
          <Container 
            sx={{
              position: 'relative', 
              overflow: 'hidden',
              minHeight: "max(20rem, min(50vw, 50vh))",
              maxHeight: '50vh'
          }}>
            <Image src={withBasePath(props.heroImage.src)} fill alt={props.heroImage.altText} style={{objectFit: 'cover'}} />
          </Container>
        }
      </Box>
    </Box>
  )
}