import React, { ForwardedRef } from "react";
import { Box, Typography } from "@mui/material";
import { RadarBlockCard } from "../base/blockCard";
import { IMarkdownBlock, MarkdownBlock } from "./md";
import { ITextBlock, TextBlock } from "./text";
import { HeroBlock, IHeroBlock } from "./hero";
import { IVideoBlock, VideoBlock } from "./video";
import { CarouselBlock, ICarouselBlock } from "./carousel";
import Grid from '@mui/material/Grid2';


type IBlockContent = IMarkdownBlock | IHeroBlock | IVideoBlock


export interface IColumnBlock {
blockType: 'column'
title?: string
subtitle?: string
content: {block1: IBlockContent, block2: IBlockContent}
}

export function ColumnBlock({title, subtitle, content, ...props}: IColumnBlock, ref: ForwardedRef<HTMLDivElement>) {
  return (
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"}>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="subtitle1">{subtitle}</Typography>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, md: 6}}>
            {getBlockContent(content.block1)}
          </Grid>
          <Grid size={{xs: 12, md: 6}}>
            {getBlockContent(content.block2)}
          </Grid>
        </Grid>
      </Box>
  )
}

interface BlockProps {
  blockBackground?: string
  blockPadding?: number | {[key: string]: number}
  noCard?: boolean
}

export type IBlock = (BlockProps & IMarkdownBlock) |
                     (BlockProps & ITextBlock) | 
                     (BlockProps & IHeroBlock) |
                     (BlockProps & IVideoBlock) |
                     (BlockProps & ICarouselBlock) |
                     (BlockProps & IColumnBlock)

function BlockContainer({children, props}: {children: React.ReactNode, props: BlockProps}): React.ReactNode {
  let padding = props.blockPadding ?? 2
  return (
    <Box 
      padding={padding}
      width="100%"
      maxWidth={"100%"}
      justifyContent="center" 
      alignItems="center"
      display="flex"
      style={{background: props.blockBackground}}
      >
        {children}
      </Box>)
}

function getBlockContent(props: IBlock) {
  switch (props.blockType) {
    case "markdown": {
      return <MarkdownBlock {...props} />
    }
    case "text": {
      return <TextBlock {...props} />
    }
    case "hero": {
      return <HeroBlock {...props} />
    }
    case "video": {
      return <VideoBlock {...props} />
    }
    case "carousel": {
      return <CarouselBlock {...props} />
    }
    case "column": {
      return <ColumnBlock {...props} />
    }
  }
}

export function Block(props: IBlock): React.ReactNode {
  const blockContent = getBlockContent(props); 
  return (
    <BlockContainer props={props}>
        {
          props.noCard ? (
            <Box sx={{width: "100%", maxWidth: "lg", textJustify: "right", textAlign: 'right', padding: 4}} >
              {blockContent}
            </Box>
          ) : (
            <RadarBlockCard>
               {blockContent}
            </RadarBlockCard>
          )
        }
      </BlockContainer>)
}