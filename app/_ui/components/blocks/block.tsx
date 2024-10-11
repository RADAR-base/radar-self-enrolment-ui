import { Box } from "@mui/material";
import { RadarBlockCard } from "../base/blockCard";
import { IMarkdownBlock, MarkdownBlock } from "./md";
import React from "react";
import { ITextBlock, TextBlock } from "./text";


interface BlockProps {
  blockBackground?: string
  blockPadding?: number | {[key: string]: number}
  noCard?: boolean
}

export type IBlock = (BlockProps & IMarkdownBlock) | (BlockProps & ITextBlock)


let b: IBlock = {
  'blockType': 'text',
  'title': 'hi',
  'content': 'asd'
}

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
      console.log('md')
      return <MarkdownBlock {...props} />
    }
    case "text": {
      console.log('text')
      return <TextBlock title={props.title} subtitle={props.subtitle} content={props.content} blockType="text" />
    }
  }
}

export function Block(props: IBlock): React.ReactNode {
  const blockContent = getBlockContent(props); 
  return (
    <BlockContainer props={props}>
        {
          props.noCard ? (
            <Box sx={{width: "100%", maxWidth: "lg", textJustify: "right", textAlign: 'right'}} padding={2} paddingLeft={4} paddingRight={4}>
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