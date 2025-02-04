"use server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { HealthKitPage } from '@/app/_ui/components/device_connect/appleHealth';
import { Box } from '@mui/material';

export default async function Page({ params }: { params: { studyId: string} }) {
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            style={{marginLeft: "min(4, calc(100vw - 100%))"}}
            display="flex"
            justifyContent="center"
            alignItems="center">
        <HealthKitPage></HealthKitPage>
      </Box>
    </main>
  )}