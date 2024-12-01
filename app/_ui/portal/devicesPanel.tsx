"use client"
import { Box, Button, Container, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import { StudyProtocol } from "@/app/_lib/study/protocol";
import NextLink from 'next/link'

import React from "react";
import { RadarDeviceCard } from "@/app/_ui/components/portal/deviceCard";
import { RadarCard } from "../components/base/card";
import { MarkdownContainer } from "../components/base/markdown";
import { withBasePath } from "@/app/_lib/util/links";

interface DevicesPanel {
  protocol: StudyProtocol
}

export function DevicesPanel(props: DevicesPanel) {
  const devices = ['fitbit', 'apple_health']

  return (
  <Container maxWidth="lg" disableGutters>
  <Grid container spacing={2} gridAutoColumns={'3lf'} gridAutoFlow={"column"}>
    <Grid size={12}>
      <RadarCard>
        <Box display={'flex'} flexDirection={'column'}
            textAlign={'left'} alignContent={'flex-start'}
            alignItems={'flex-start'}
            padding={2}>
          <Typography variant="h2">Connect Devices</Typography>
          <MarkdownContainer>
          {"By sharing your activity data with us we gain valuable insights into recovery and mobility after knee replacement surgery.\n<br />\nFollow the step-by-step instructions [link TBC] or watch a video [link TBC] to show you how to connect your fitness tracker or smartphone app.\n<br />\nYou can find out more information about the way we use personal information, and the rights individuals have to control and manage their data by reading our privacy policy\n<br />\n**How do I Identify my device?**\n\nCheck the logo on your fitness tracker or smartphone application to find your device or app below."}
          </MarkdownContainer>
          <Box display='flex' flexDirection='row' justifyContent={'space-between'} width={'100%'} paddingTop={2}>
            <NextLink href={'/paprka/portal'} passHref legacyBehavior>
                <Button variant="contained">
                    Back
                </Button>
              </NextLink>
            <Button variant="contained">Finish</Button>
           
          </Box>
        </Box>
      </RadarCard>
    </Grid>
    {devices.map((deviceId, i) => (
      <Grid size={{xs: 12, sm: 6, md: 4}} key={'task.'+i}>
        <RadarDeviceCard deviceId={deviceId}></RadarDeviceCard>
      </Grid>
    ))}
  </Grid>
  </Container>)

}