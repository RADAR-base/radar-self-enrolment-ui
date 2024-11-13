"use client"
import { ArmtMetadata } from "@/app/_lib/study/protocol";
import { Box, Button, Paper, Stack, styled, Typography } from "@mui/material";
import React from "react";

export type RadarBlockCardClassKey = "root";

export interface RadarTaskCardProps {
  metadata: ArmtMetadata
  status?: "pending" | "complete" | "disabled"
}

const RadarTaskCardRoot = styled(Paper, {name: 'RadarTaskCard', slot: 'root'})(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(4),
  margin: 0,
  color: theme.palette.text.secondary,
  // boxShadow: 'none',
  width: "100%",
  height: "100%",
  maxWidth: "lg"
}));



export const RadarTaskCard = React.forwardRef(function RadarBlockCard({metadata: {title, description, optional}, status}: RadarTaskCardProps, ref) {
  return <RadarTaskCardRoot>
    <Stack gap={2}>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Box display='flex' alignItems={"center"} justifyContent={"space-between"}>
        <Typography variant="subtitle1">{optional ? "Optional" : ""}</Typography>
        <Button 
          variant="contained"
          color={(status == "complete") ? "success" : "warning"}
          disabled={status == "disabled"}
          >
            {(status == "complete") ? "Done" : "Todo"}
        </Button>
      </Box>
    </Stack>
  </RadarTaskCardRoot>
})

