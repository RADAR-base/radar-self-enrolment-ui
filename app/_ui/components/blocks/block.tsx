import { Box } from "@mui/material";
import { RadarBlockCard } from "../base/blockCard";
import { IMarkdownBlock, MarkdownBlock } from "./md";
import React from "react";
import { ITextBlock, TextBlock } from "./text";
import { HeroBlock, IHeroBlock } from "./hero";


interface BlockProps {
  blockBackground?: string
  blockPadding?: number | {[key: string]: number}
  noCard?: boolean
}

export type IBlock = (BlockProps & IMarkdownBlock) | (BlockProps & ITextBlock) | (BlockProps & IHeroBlock)

function BlockContainer({children, props}: {children: React.ReactNode, props: BlockProps}): React.ReactNode {
  let padding = props.blockPadding ?? {xs: 0, sm: 2} 
  return (
    <Box 
      paddingLeft={padding}
      paddingRight={padding}
      width="100%"
      maxWidth={"100%"}
      justifyContent="center" 
      alignItems="center"
      display="flex"
      sx={{background: props.blockBackground}}>
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
  }
}

export function Block(props: IBlock): React.ReactNode {
  const blockContent = getBlockContent(props); 
  return (
    <BlockContainer props={props}>
        {
          props.noCard ? (
            <Box sx={{width: "100%", maxWidth: "lg", textJustify: "right", textAlign: 'right'}}>
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