"use client"
import { Button, Container, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import { StudyProtocol } from "@/app/_lib/study/protocol";
import React, { useEffect, useState } from "react";
import { withBasePath } from "@/app/_lib/util/links";
import { useRouter, useSearchParams } from "next/navigation";
import { RadarCard } from "../base/card";
import {QRCodeSVG} from 'qrcode.react'
import Image from 'next/image'

const _clientId = '22BGY5';

let url = new URL('https://www.fitbit.com/oauth2/authorize')
url.search = new URLSearchParams([
  [  'response_type', 'code'],
    ['client_id', _clientId],
    ['redirect_uri',  'https://dev.radarbasedev.co.uk/kratos-ui/paprka/portal/connect/fitbit'],
    ['expires_in', '604800'],
    ['scope', ['activity', 'heartrate', 'location', 'nutrition', 'profile', 'sleep', 'weight'].join(' ')]
]
).toString()

interface FitbitPageProps {
  protocol: StudyProtocol
}

export function FitbitPage(props: FitbitPageProps) {
  const studyId = props.protocol.studyId
  const searchParams = useSearchParams()
  const fitbitCode = searchParams.get('code')
  const router = useRouter()

  const [test, setTest] = useState<any>(undefined)

  if (fitbitCode != undefined) {
    router.push(`/${studyId}/portal/connect?success=Fitbit`)
  }

  useEffect(() => {
    if (test == undefined) {
      fetch(withBasePath('/api/connect/armtApp'), {
          credentials: 'include'
        }
      ).then(
          (r) => {
            if (r.ok) {
              console.log(r)
              r.json().then(
                (d) => setTest(d)
              )
            }
          }
        )
      }
  })

  return (
  <Container maxWidth="lg" disableGutters>
    <RadarCard>
      <Grid container spacing={2} padding={3} gap={2} rowGap={4}>
        <Grid size={12} textAlign={'left'}>
          <div>
            <Typography variant="h2">Connect your Fitbit</Typography>
            <Typography variant="body1">
              Please follow the below instructions to connect your Fitbit account and allow us to access your wearable data stored by Fitbit.
              The first step will take you to Fitbit's website, so it may be useful to look through the steps before starting the process.
            </Typography>
          </div>
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 1: Click the "Link Fitbit" button</Typography>
          <Typography variant="body1">This will redirect you away from this page to Fitbit's website. At the end of the process, you will return here.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Button href={url.toString()} variant="contained">Link Fitbit</Button>
        </Grid>
        
        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 2: Log in</Typography>
          <Typography variant="body1">If you are not already logged in to your Fitbit account, you will be redirected to a sign in page. Please log in with your Fitbit account.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
              src={withBasePath('/devices/fitbit/fitbit_login.png')}
              width={240}
              height={400}
              alt='A placeholder image which should show the opening screen of the RADAR app'
              style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
            />
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 3: Select the data you want to share</Typography>
          <Typography variant="body1">So that we can learn as much as possible, we would appreciate it if you were able to allow all of the requested data.</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Image 
              src={withBasePath('/devices/fitbit/fitbit_scopes.png')}
              width={320}
              height={400}
              alt='A placeholder image which should show the opening screen of the RADAR app'
              style={{borderRadius: 16, boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.15)'}}
            />
        </Grid>

        <Grid size={{xs: 12, sm: 6}} textAlign={'left'}>
          <Typography variant="h3">Step 4: Done</Typography>
          <Typography variant="body1">Press the following 'Finish' button to continue</Typography>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Button variant={'contained'}
            onClick={() => router.push('./?success=Fitbit')}
          >
            {`    Finish    `}
          </Button>
        </Grid>

      </Grid>
      
    </RadarCard>
  </Container>
  )
}