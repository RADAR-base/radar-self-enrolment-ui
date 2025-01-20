"use server"
import { Box } from '@mui/material';
import { GarminPage } from '@/app/_ui/components/device_connect/garmin';

export default async function Page({ params }: { params: { studyId: string} }) {
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            style={{marginLeft: "min(4, calc(100vw - 100%))"}}
            display="flex"
            justifyContent="center"
            alignItems="center">
        <GarminPage></GarminPage>
      </Box>
    </main>
  )}