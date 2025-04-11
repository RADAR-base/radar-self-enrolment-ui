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
  'radar_armt': {
    title: 'RADAR Questionnaire',
    description: 'Apple iPhone or Android phone'
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

const DEFAULT_DEVICES = ['radar_armt']

export function DevicesPanel() {
  const [submitting, setSubmitting] = useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const deviceConnected = searchParams.get('success')

  
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
    }
    setSubmitting(false)
  }


  const protocol = useContext(ProtocolContext)
  const projectId = protocol.studyId
  const task = (protocol.protocols
    .find((p) => ((p.metadata.type == 'inbuilt') && (p.metadata.inbuiltId == 'connect')))
    ?.metadata as ArmtMetadataInbuilt)
  let devices = task.options.devices as {id: string, title: string, logo_src: string, description: string}[]

  let deviceConnectedName: string = ""
  if (deviceConnected) {
    deviceConnectedName = devices.find(d => d.id == deviceConnected)?.title ?? deviceConnected
  }

  const title: string = task.options.title ?? "Connect Your Device"
  const description: string = task.options.description ?? "Please click on the device below which you would like to connect"
  
  return (
  <Container maxWidth="lg" disableGutters>
  {(deviceConnected != undefined) ? <DeviceConnectedBanner device={deviceConnectedName} onFinish={onSubmit} /> : null}
  <Grid container spacing={2} gridAutoColumns={'3lf'} gridAutoFlow={"column"}>
    <Grid size={12}>
      <RadarCard>
        <Box display={'flex'} flexDirection={'column'}
            textAlign={'left'} alignContent={'flex-start'}
            alignItems={'flex-start'}
            padding={3}>
          <Typography variant="h2">{title}</Typography>
          <MarkdownContainer>{description}</MarkdownContainer>
          <Box display='flex' flexDirection='row' justifyContent={'space-between'} width={'100%'} paddingTop={2}>
            <NextButton href={`/${projectId}/portal`} variant='contained'>Back</NextButton>
            <Button variant="contained" onClick={onSubmit} disabled={submitting}>
                Submit
            </Button>
          </Box>
        </Box>
      </RadarCard>
    </Grid>
    {devices.map((device, i) => (
      <Grid size={{xs: 12, sm: 6, md: 4}} key={'task.'+i}>
        <RadarDeviceCard deviceId={device.id} title={device.title} description={device.description} ></RadarDeviceCard>
      </Grid>
    ))}
  </Grid>
  </Container>)
}