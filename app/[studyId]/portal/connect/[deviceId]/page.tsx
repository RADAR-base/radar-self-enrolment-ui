"use server";
import { HealthKitPage } from '@/app/_ui/components/device_connect/appleHealth';
import { FitbitPage } from '@/app/_ui/components/device_connect/fitbit';
import { GoogleHealthPage } from '@/app/_ui/components/device_connect/googleHealth';
import { HuaweiPage } from '@/app/_ui/components/device_connect/huawei';
import { GarminPage } from '@/app/_ui/components/device_connect/garmin';
import { OuraPage } from '@/app/_ui/components/device_connect/oura';
import { ArmtPage } from '@/app/_ui/components/device_connect/radarArmt';
import { PrmtPage } from '@/app/_ui/components/device_connect/radarPrmt';
import { ConnectDeviceConfig } from '@/app/_lib/study/protocol';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { Box } from '@mui/material';
import { notFound } from 'next/navigation';

import type { JSX } from "react";

export default async function Page(props: { params: Promise<{ studyId: string, deviceId: string}> }) {
  const params = await props.params;

  const registry = new StudyProtocolRepository()
  const protocol = await registry.getStudyProtocol(params.studyId)
  const connectTask = protocol?.protocols.find(p => p.id === 'connect')
  const deviceConfig = (connectTask?.metadata.options.devices as ConnectDeviceConfig[] | undefined)
    ?.find(d => d.id === params.deviceId)

  var content: JSX.Element

  switch (params.deviceId) {
    case "fitbit":
      content = <FitbitPage guideUrl={deviceConfig?.guideUrl} videoUrl={deviceConfig?.videoUrl} />
      break
    case "google_health":
      content = <GoogleHealthPage guideUrl={deviceConfig?.guideUrl} videoUrl={deviceConfig?.videoUrl} />
      break
    case "huawei":
      content = <HuaweiPage guideUrl={deviceConfig?.guideUrl} videoUrl={deviceConfig?.videoUrl} />
      break
    case "apple_health":
      content = <HealthKitPage guideUrl={deviceConfig?.guideUrl} videoUrl={deviceConfig?.videoUrl} />
      break
    case "garmin":
      content = <GarminPage guideUrl={deviceConfig?.guideUrl} videoUrl={deviceConfig?.videoUrl} />
      break
    case "oura":
      content = <OuraPage guideUrl={deviceConfig?.guideUrl} videoUrl={deviceConfig?.videoUrl} />
      break
    case "radar_armt":
      content = <ArmtPage guideUrl={deviceConfig?.guideUrl} videoUrl={deviceConfig?.videoUrl} />
      break
    case "radar_prmt":
      content = <PrmtPage guideUrl={deviceConfig?.guideUrl} videoUrl={deviceConfig?.videoUrl} />
      break
    default:
      return notFound()
    }
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            style={{marginLeft: "min(4, calc(100vw - 100%))"}}
            display="flex"
            justifyContent="center"
            alignItems="center">
        {content}
      </Box>
    </main>
  )
}