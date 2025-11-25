"use client"
import { withBasePath } from "@/app/_lib/util/links";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { MarkdownContainer } from "../base/markdown";
import React, { useContext } from "react";
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client";


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
  const theme = useTheme()
  let sx2 = {width: { xs: "auto", sm: "auto" }}
  let sx = theme.components?.MuiButton?.defaultProps?.sx
  sx = {...sx, ...sx2}
  return <Button variant="contained" 
                 href={cta.href}
                 onClick={cta.onClick}
                 sx={sx}>
          {cta.text}
        </Button>
}

function CTAButtons(cta?: ICallToAction, cta2?: ICallToAction) {

  const cta1Button = cta ? CTAButton(cta) : undefined
  const cta2Button = cta2 ? CTAButton(cta2) : undefined
  return <Box display={"flex"} flexShrink={0} gap={2} flexDirection={{xs: 'column', sm: 'row'}}>{cta1Button}{cta2Button}</Box>
}

export interface IHeroBlock {
  blockType: 'hero'
  title?: any
  subtitle?: string
  heroImage?: IHeroImage
  cta?: ICallToAction
  cta2?: ICallToAction
}

export function HeroBlock(props: IHeroBlock) {
  const flex = props.heroImage ? 0.6 : 0.6
  const protocol = useContext(ProtocolContext)

  const resolveHref = (href?: string): string | undefined => {
    if (!href) return undefined
    // external links (http, https, mailto, tel, etc.)
    if (/^\w+:/.test(href)) return href
    // already study-scoped
    if (protocol?.studyId && href.startsWith(`/${protocol.studyId}/`)) return href
    // normalize and prefix with study id
    const trimmed = href.startsWith('/') ? href.slice(1) : href
    return protocol?.studyId ? `/${protocol.studyId}/${trimmed}` : `/${trimmed}`
  }

  const ctaResolved = props.cta ? { ...props.cta, href: resolveHref(props.cta.href) } : undefined
  const cta2Resolved = props.cta2 ? { ...props.cta2, href: resolveHref(props.cta2.href) } : undefined
  return (
    <Box 
      display={"flex"} 
      flexDirection={{xs: "column-reverse", sm: "row"}}
      justifyContent={'flex-start'}
      minHeight={"40vh"}
    >
      <Box display={"flex"} flexDirection={"column"} justifyContent={'center'} textAlign={{xs: "center", sm: "left"}} flexShrink={1} flex={flex} gap={1}>
        {props.title?.children ? <Typography variant="h1" {...props.title}></Typography> : <Typography variant="h1">{props.title}</Typography> }
        <MarkdownContainer>{props.subtitle}</MarkdownContainer>
        {CTAButtons(ctaResolved, cta2Resolved)}
      </Box>
      {props.heroImage && <Box flex={1}>
          <Container 
            sx={{
              position: 'relative', 
              overflow: 'hidden',
              minHeight: "max(20rem, min(50vw, 50vh))",
              maxHeight: '50vh'
          }}>
            <Image src={withBasePath(props.heroImage.src)} fill alt={props.heroImage.altText} style={{objectFit: 'cover'}} />
          </Container>
      </Box>
      }
    </Box>
  )
}