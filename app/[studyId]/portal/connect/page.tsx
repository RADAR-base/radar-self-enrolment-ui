"use server"
import { Box, Container } from '@mui/material';
import { DevicesPanel } from '@/app/_ui/portal/devicesPanel';

export default async function Page({ params }: { params: { studyId: string} }) {
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            style={{marginLeft: "min(4, calc(100vw - 100%))"}}
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <DevicesPanel />
        </Container>
      </Box>
    </main>
  )}