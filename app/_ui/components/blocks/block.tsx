import { Box } from "@mui/material";
import { RadarBlockCard } from "../base/blockCard";
import { IMarkdownBlock, MarkdownBlock } from "./md";
import React from "react";


interface BlockProps {
  blockBackground?: string
  blockPadding?: number | {[key: string]: number}
  noCard?: boolean
}

export type IBlock = BlockProps & (IMarkdownBlock)

function BlockContainer({children, props}: {children: React.ReactNode, props: BlockProps}): React.ReactNode {
  let padding = props.blockPadding ?? {xs: 0, sm: 2} 
  return (
    <Box 
      padding={padding}
      width="100vw"
      maxWidth={"100%"}
      justifyContent="center" 
      alignItems="center"
      display="flex"
      sx={{background: props.blockBackground}}>
        {children}
      </Box>)
}

export function Block(props: IBlock): React.ReactNode {
  switch (props.blockType) {
    case "markdown": {
      return (
        <BlockContainer props={props}>
            {
              props.noCard ? (
                <Box sx={{width: "100%", maxWidth: "lg", textJustify: "right", textAlign: 'right'}} padding={2} paddingLeft={4} paddingRight={4}>
                  <MarkdownBlock {...props} />
                </Box>
              ) : (
                <RadarBlockCard>
                  <MarkdownBlock {...props} />
                </RadarBlockCard>
              )
            }

          </BlockContainer>)
    }
  }
}