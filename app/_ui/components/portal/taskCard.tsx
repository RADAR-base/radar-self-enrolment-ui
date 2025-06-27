"use client"
import { ArmtMetadata, ArmtProtocol } from "@/app/_lib/study/protocol";
import { Box, Button, Paper, Stack, styled, Typography } from "@mui/material";
import React from "react";
import NextLink from 'next/link'
import { metadata } from "@/app/layout";
import { MarkdownContainer } from "../base/markdown";

export type RadarBlockCardClassKey = "root";

export interface RadarTaskCardProps {
  armtProtocol: ArmtProtocol
  status?: "todo" | "done" | "disabled"
}

const RadarTaskCardRoot = styled(Paper, {name: 'RadarTaskCard', slot: 'root'})(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
  // boxShadow: 'none',
  width: "100%",
  height: "100%",
  maxWidth: "lg"
}));


export const RadarTaskCard = React.forwardRef(function RadarBlockCard({armtProtocol, status}: RadarTaskCardProps, ref) {
  const title = armtProtocol.metadata.title
  const description = armtProtocol.metadata.description
  const optional = armtProtocol.metadata.optional
  const id = armtProtocol.id

  return <RadarTaskCardRoot>
    <Box display='flex' flexDirection={'column'} justifyContent={'space-between'} height={"100%"} gap={4}>
      <Box display='block'>
        <Typography variant="h3">{title}</Typography>
        <MarkdownContainer>{description}</MarkdownContainer>
      </Box>
      <Box display='flex' alignItems={"center"} justifyContent={"space-between"}>
        <Typography variant="subtitle1">{optional ? "Optional" : ""}</Typography>
        {/* <NextLink href={'portal/' + id} passHref legacyBehavior> */}
          <Button 
            href={'portal/' + id}
            variant="contained"
            color={(status == "done") ? "success" : "warning"}
            disabled={status == "disabled" || status == "done"}
            >
              {(status == "done") ? "Done" : "To Do"}
          </Button>
        {/* </NextLink> */}
      </Box>
    </Box>
  </RadarTaskCardRoot>
})

