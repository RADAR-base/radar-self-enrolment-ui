"use client"
import { Paper, styled, Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";
import React from "react";

export type RadarCardClassKey = "root";

export interface RadarCardProps {
  children: React.ReactNode;
}

const RadarCardRoot = styled(Paper, {name: 'RadarCard', slot: 'root'})(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  overflow: 'clip'
  // boxShadow: 'none'
}));



export const RadarCard = React.forwardRef(function RadarCard(
  props: RadarCardProps, ref
) {
  const {children} = props;
  return <RadarCardRoot>
    {children}
  </RadarCardRoot>
})

