import { RadarCard } from '@/app/_ui/components/base/card';
import { Box, Container } from '@mui/material';

export default function Page({ params }: { params: { studyId: string, customPage: string } }) {
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <RadarCard>
            {params.customPage}
          </RadarCard>
        </Container>
      </Box>
    </main>
  )}