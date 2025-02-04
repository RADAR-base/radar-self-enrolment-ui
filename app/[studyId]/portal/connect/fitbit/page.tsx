"use server"
import { Box, Button, Container } from '@mui/material';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { RadarCard } from '@/app/_ui/components/base/card';
import { FitbitPage } from '@/app/_ui/components/device_connect/fitbit';

export default async function Page({ params }: { params: { studyId: string} }) {
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            style={{marginLeft: "min(4, calc(100vw - 100%))"}}
            display="flex"
            justifyContent="center"
            alignItems="center">
        <FitbitPage></FitbitPage>
      </Box>
    </main>
  )}