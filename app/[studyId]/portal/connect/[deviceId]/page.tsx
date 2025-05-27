"use server"
import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { getRestSourceAuthLink, makeRestSourceUser } from '@/app/_lib/connect/rsa/authorizer';
import { withBasePath } from '@/app/_lib/util/links';
import { HealthKitPage } from '@/app/_ui/components/device_connect/appleHealth';
import { FitbitPage } from '@/app/_ui/components/device_connect/fitbit';
import { GarminPage } from '@/app/_ui/components/device_connect/garmin';
import { OuraPage } from '@/app/_ui/components/device_connect/oura';
import { ArmtPage } from '@/app/_ui/components/device_connect/radarArmt';
import { Box } from '@mui/material';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

const DEVICE_CONNECT_ID_MAP: {[key: string]: string} = {
  "fitbit": "FitBit",
  "garmin": "Garmin",
  "oura": "Oura"
}

async function getRsaLink(deviceId: string, redirect_uri?: string) {
  const token = await cookies().get('sep_access_token')
  if (token == null) { return null }
  const sourceType = deviceId
  const userSession = await (await whoAmI()).json()
  const study = userSession['identity']['traits']['projects'][0]
  const userId = study['userId']
  const studyId = study['id']
  const rsaUserId = await makeRestSourceUser(token.value, userId, studyId, sourceType)
  if (rsaUserId == null) { return null }
  const authLink = await getRestSourceAuthLink(token.value, rsaUserId, 
                                               redirect_uri ?? withBasePath(`/${studyId}/portal/connect&success=${deviceId}`))
  return authLink
}

export default async function Page({ params }: { params: { studyId: string, deviceId: string} }) {
  var content: JSX.Element
  var link: string | null = null

  if (['fitbit', 'garmin', 'oura'].includes(params.deviceId)) {
    try {
      link = await getRsaLink(DEVICE_CONNECT_ID_MAP[params.deviceId])
    } catch {
      link = null
    }
  }

  switch (params.deviceId) {
    case "fitbit":
      content = <FitbitPage authLink={link} /> 
      break
    case "apple_health":
      content = <HealthKitPage />
      break
    case "garmin":
      content = <GarminPage authLink={link} />
      break
    case "oura":
      content = <OuraPage authLink={link} />
      break
    case "radar_armt":
      content = <ArmtPage />
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