"use server";
import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { getRestSourceAuthLink, makeRestSourceUser } from '@/app/_lib/connect/rsa/authorizer';
import { withBasePath } from '@/app/_lib/util/links';
import { HealthKitPage } from '@/app/_ui/components/device_connect/appleHealth';
import { FitbitPage } from '@/app/_ui/components/device_connect/fitbit';
import { GarminPage } from '@/app/_ui/components/device_connect/garmin';
import { OuraPage } from '@/app/_ui/components/device_connect/oura';
import { ArmtPage } from '@/app/_ui/components/device_connect/radarArmt';
import { PrmtPage } from '@/app/_ui/components/device_connect/radarPrmt';
import { Box } from '@mui/material';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import type { JSX } from "react";

export default async function Page(props: { params: Promise<{ studyId: string, deviceId: string}> }) {
  const params = await props.params;
  var content: JSX.Element

  switch (params.deviceId) {
    case "fitbit":
      content = <FitbitPage /> 
      break
    case "apple_health":
      content = <HealthKitPage />
      break
    case "garmin":
      content = <GarminPage />
      break
    case "oura":
      content = <OuraPage />
      break
    case "radar_armt":
      content = <ArmtPage />
      break
    case "radar_prmt":
      content = <PrmtPage />
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