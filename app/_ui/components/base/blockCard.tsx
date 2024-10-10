"use client"
import { Paper, styled, Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";
import React from "react";

export type RadarBlockCardClassKey = "root";

export interface RadarBlockCardProps {
  maxWidth?: string | number,
  children: React.ReactNode;
}

const RadarBlockCardRoot = styled(Paper, {name: 'RadarBlockCard', slot: 'root'})(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(4),
  margin: 0,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  boxShadow: 'none',
}));



export const RadarBlockCard = React.forwardRef(function RadarBlockCard(
  {maxWidth, children}: RadarBlockCardProps, ref
) {
  let mw = maxWidth ?? "lg"
  return <RadarBlockCardRoot sx={{width: "100%", maxWidth: mw}}>
    {children}
  </RadarBlockCardRoot>
})

