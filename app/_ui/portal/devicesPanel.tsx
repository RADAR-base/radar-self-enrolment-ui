"use client"
import { Box, Button, Container, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import { ArmtMetadataInbuilt, StudyProtocol } from "@/app/_lib/study/protocol";
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'

import React, { useContext, useState } from "react";
import { RadarDeviceCard } from "@/app/_ui/components/portal/deviceCard";
import { RadarCard } from "../components/base/card";
import { MarkdownContainer } from "../components/base/markdown";
import { withBasePath } from "@/app/_lib/util/links";
import { useRouter } from "next/navigation";
import NextButton from "../components/base/nextButton";
import { DeviceConnectedBanner } from "../components/device_connect/successBanner";
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client";

const TEMP_CONTENT: {[key: string]: any} = {
  'fitbit': {
    title: 'Fitbit',
    description: 'Wearable fitness tracker'
  },
  'apple_health': {
    title: 'Apple Health',
    description: 'Apple Watch or iPhone'
  },  
  'garmin': {
    title: 'Garmin',
    description: 'Wearable fitness tracker'
  },
  'oura': {
    title: 'Oura',
    description: 'Wearable fitness tracker'
  },
}

const DEFAULT_DEVICES = ['fitbit', 'apple_health', 'garmin', 'oura']

export function DevicesPanel() {
  const [submitting, setSubmitting] = useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const deviceConnected = searchParams.get('success')
  const protocol = useContext(ProtocolContext);
  const devices = ((protocol.protocols
                          .find((p) => ((p.metadata.type == 'inbuilt') && (p.metadata.inbuiltId == 'connect')))
                          ?.metadata as ArmtMetadataInbuilt).options.devices as string[] 
                  ?? DEFAULT_DEVICES)

  async function onSubmit() {
    setSubmitting(true)
    let resp = await fetch(
      withBasePath('/api/study/' + protocol.studyId + '/tasks/connect'),
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({})
      }
    )
    if (resp.ok) {
      router.push('/' + protocol.studyId + '/portal') 
    } else {
      console.log(await resp.json())
    }
    setSubmitting(false)
  }

  return (
  <Container maxWidth="lg" disableGutters>
  {(deviceConnected != undefined) ? <DeviceConnectedBanner device={deviceConnected} onFinish={onSubmit}></DeviceConnectedBanner> : null}
  <Grid container spacing={2} gridAutoColumns={'3lf'} gridAutoFlow={"column"}>
    <Grid size={12}>
      <RadarCard>
        <Box display={'flex'} flexDirection={'column'}
            textAlign={'left'} alignContent={'flex-start'}
            alignItems={'flex-start'}
            padding={3}>
          <Typography variant="h2">Connect Your iPhone, Fitness Tracker or Smartphone App</Typography>
          <MarkdownContainer>
          {"By sharing your activity data with us we gain valuable insights into recovery and mobility after knee replacement surgery.\n<br />\nFollow the step-by-step instructions [link TBC] or watch a video [link TBC] to show you how to connect your iPhone, fitness tracker or smartphone app.\n<br />\nYou can find out more information about the way we use personal information, and the rights individuals have to control and manage their data by reading our [privacy policy](https://documents.manchester.ac.uk/display.aspx?DocID=37095)\n<br />\n**How do I Identify my device?**\n\nCheck the logo on your fitness tracker or smartphone application to find your device or app below."}
          </MarkdownContainer>
          <Box display='flex' flexDirection='row' justifyContent={'space-between'} width={'100%'} paddingTop={2}>
            <NextButton href={'/paprka/portal'} variant='contained'>Back</NextButton>
            <Button variant="contained" onClick={onSubmit} disabled={submitting}>
                Submit
            </Button>
          </Box>
        </Box>
      </RadarCard>
    </Grid>
    {devices.map((deviceId, i) => (
      <Grid size={{xs: 12, sm: 6, md: 4}} key={'task.'+i}>
        <RadarDeviceCard deviceId={deviceId} title={TEMP_CONTENT[deviceId].title} description={TEMP_CONTENT[deviceId].description} ></RadarDeviceCard>
      </Grid>
    ))}
  </Grid>
  </Container>)
}