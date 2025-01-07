"use client"
import { ArmtMetadata, ArmtProtocol } from "@/app/_lib/study/protocol";
import { Box, Button, Card, Paper, Stack, styled, Typography } from "@mui/material";
import React from "react";
import NextLink from 'next/link'
import { metadata } from "@/app/layout";
import Image from 'next/image'
import { withBasePath } from "@/app/_lib/util/links";

export type RadarBlockCardClassKey = "root";

export interface RadarDeviceCardProps {
  deviceId: string
  status?: "todo" | "done" | "disabled",
  title: string,
  description: string
}

const RadarDeviceCardRoot = styled(Paper, {name: 'RadarDeviceCard', slot: 'root'})(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
  // boxShadow: 'none',
  width: "100%",
  height: "100%",
  maxWidth: "lg"
}));


export const RadarDeviceCard = React.forwardRef(function RadarDeviceCard({deviceId, status, title, description}: RadarDeviceCardProps, ref) {
  return <RadarDeviceCardRoot>
    <Box display='flex' gap={2} height={"100%"} flexDirection={'row'} justifyItems={'center'}>
      <Image width={100} height={100} 
          src={withBasePath('/devices/' + deviceId + '.png')} 
          alt={deviceId}
          style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
      />
      <Box display='flex' flexDirection={'column'} width={"100%"} justifyContent={'space-between'} gap={2}>
        <Box display='flex' flexDirection={"column"}>        
          <Typography variant="h3">{title}</Typography>
          <Typography variant="body1">{description}</Typography>
        </Box>
        <NextLink href={'connect/' + deviceId} passHref legacyBehavior>
          <Button 
            style={{alignSelf: 'flex-end'}}
            variant="contained"
            color={(status == "done") ? "success" : "warning"}
            disabled={status == "disabled"}
            >
              {(status == "done") ? "Connected" : "Connect"}
          </Button>
        </NextLink>
        </Box>
      </Box>
  </RadarDeviceCardRoot>
})

