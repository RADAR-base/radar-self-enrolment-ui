"use server"
import { ArmtPage } from '@/app/_ui/components/device_connect/radarArmt';
import { Box } from '@mui/material';

export default async function Page({ params }: { params: { studyId: string} }) {
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            style={{marginLeft: "min(4, calc(100vw - 100%))"}}
            display="flex"
            justifyContent="center"
            alignItems="center">
        <ArmtPage></ArmtPage>
      </Box>
    </main>
  )}