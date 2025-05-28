"use client"
import { Box, Button, Container, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import { ArmtMetadataInbuilt, StudyProtocol } from "@/app/_lib/study/protocol";
import NextLink from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import React, { useContext, useEffect, useState } from "react";
import { RadarDeviceCard } from "@/app/_ui/components/portal/deviceCard";
import { RadarCard } from "../components/base/card";
import { MarkdownContainer } from "../components/base/markdown";
import { withBasePath } from "@/app/_lib/util/links";
import { useRouter } from "next/navigation";
import NextButton from "../components/base/nextButton";
import { DeviceConnectedBanner } from "../components/device_connect/successBanner";
import { ProtocolContext } from "@/app/_lib/study/protocol/provider.client";


interface DevicePanelProps {
  deviceStatuses?: { [key: string]: boolean }
}

export function DevicesPanel(props: DevicePanelProps) {
  const [submitting, setSubmitting] = useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const deviceConnected = searchParams.get('success')
  const [device, setDevice] = useState<string | undefined>(deviceConnected ?? undefined)
  const pathname = usePathname()

  useEffect(() => {
    if (deviceConnected) {
      setDevice(deviceConnected)
      markDeviceConnected(deviceConnected.toLowerCase()).then(
        () => {
          router.replace(pathname)
        }
      )
    }
  }, [])

  async function markDeviceConnected(device_id?: string) {
    var body;
    if (device_id) {
      body = {[device_id]: true}
    } else {
      body = {}
    }
    let resp = await fetch(
      withBasePath('/api/study/' + protocol.studyId + '/tasks/connect'),
      {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      }
    )
    return resp
  }

  async function onSubmit() {
    setSubmitting(true)
    markDeviceConnected('').then(
      () => {
        router.push('/' + protocol.studyId + '/portal')
      }
    )
  }

  const protocol = useContext(ProtocolContext)
  const projectId = protocol.studyId
  const task = (protocol.protocols
    .find((p) => ((p.metadata.type == 'inbuilt') && (p.metadata.inbuiltId == 'connect')))
    ?.metadata as ArmtMetadataInbuilt)
  let devices = task.options.devices as {id: string, title: string, logo_src: string, description: string}[]

  let deviceConnectedName: string = ""
  if (device) {
    deviceConnectedName = devices.find(d => d.id == device)?.title ?? device
  }

  const title: string = task.options.title ?? "Connect Your Device"
  const description: string = task.options.description ?? "Please click on the device below which you would like to connect"
  
  return (
    <Container maxWidth="lg" disableGutters>
    {(device != undefined) ? <DeviceConnectedBanner device={deviceConnectedName} onFinish={onSubmit} /> : null}
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
                  Mark as complete
              </Button>
            </Box>
          </Box>
        </RadarCard>
      </Grid>
      {devices.map((d, i) => {
        var status;
        if (props.deviceStatuses) {
          if (props.deviceStatuses[d.id]) {
            status = "done" as const
          } else {
            status = "todo" as const
          }
        } else {
          status = "todo" as const
        }
        return  <Grid size={{xs: 12, sm: 6, md: 4}} key={'task.'+i}>
                  <RadarDeviceCard deviceId={d.id} title={d.title} description={d.description} status={status}/>
                </Grid>
      })
    }
    </Grid>
    </Container>)
}