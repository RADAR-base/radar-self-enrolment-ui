"use client"
import { Container } from "@mui/material"
import Grid from '@mui/material/Grid2';
import { StudyProtocol } from "@/app/_lib/study/protocol";

import React from "react";
import { RadarDeviceCard } from "@/app/_ui/components/portal/deviceCard";

interface DevicesPanel {
  protocol: StudyProtocol
}

export function DevicesPanel(props: DevicesPanel) {
  const devices = ['fitbit', 'apple_health']

  return (
  <Container maxWidth="lg" disableGutters>
  <Grid container spacing={2} gridAutoColumns={'3lf'} gridAutoFlow={"column"}>
    {devices.map((deviceId, i) => (
      <Grid size={{xs: 12, sm: 6, md: 4}} key={'task.'+i}>
        <RadarDeviceCard deviceId={deviceId}></RadarDeviceCard>
      </Grid>
    ))}
  </Grid>
  </Container>)

}