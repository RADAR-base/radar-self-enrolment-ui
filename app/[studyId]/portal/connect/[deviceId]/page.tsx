"use server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { HealthKitPage } from '@/app/_ui/components/device_connect/appleHealth';
import { FitbitPage } from '@/app/_ui/components/device_connect/fitbit';
import { GarminPage } from '@/app/_ui/components/device_connect/garmin';
import { OuraPage } from '@/app/_ui/components/device_connect/oura';
import { ArmtPage } from '@/app/_ui/components/device_connect/radarArmt';
import { Box } from '@mui/material';
import { notFound } from 'next/navigation';

const DEVICE_CONNECT_CONTENT: {[key: string]: JSX.Element | undefined} = {
  "apple_health": <HealthKitPage />,
  "fitbit": <FitbitPage />,
  "garmin": <GarminPage />,
  "oura": <OuraPage />,
  "radar_armt": <ArmtPage />
}

export default async function Page({ params }: { params: { studyId: string, deviceId: string} }) {
  if (params.deviceId in DEVICE_CONNECT_CONTENT) {
    const content = DEVICE_CONNECT_CONTENT[params.deviceId]
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
  } else {
    notFound()
  }
}