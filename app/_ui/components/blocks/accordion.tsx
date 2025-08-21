import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import { ForwardedRef } from "react";
import { MarkdownContainer } from "../base/markdown";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export interface IAccordionBlock {
  blockType: 'accordion'
  title?: string
  subtitle?: string
  items: {
    title: string, 
    content: string
  }[]
}

export function AccordionBlock({title, subtitle, items}: IAccordionBlock) {
  return (
      <Box display={"flex"} flexDirection={"column"} textAlign={"left"} gap={2}>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="subtitle1">{subtitle}</Typography>
        <Box>
        {items.map(
          (item => {
            return (        
              <Accordion disableGutters={true}>
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                  <Typography variant="h4">                  
                    {item.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <MarkdownContainer>              
                    {item.content}
                  </MarkdownContainer>
                </AccordionDetails>
              </Accordion>
            )
          })
        )}
        </Box>
      </Box>
  )
}