"use server"
import { Box, Container } from '@mui/material';
import { RadarCard } from '@/app/_ui/components/base/card';

export default async function Page({ params }: { params: { studyId: string } }) {
  return (
    <main>
      <Container maxWidth="lg" disableGutters>
        <Box marginTop={2} marginBottom={2} maxWidth={600} justifySelf={'center'} width='100%'>
          <RadarCard>
            <Box padding={4}>
              Recovery
            </Box>
          </RadarCard>
      </Box>
      </Container>
    </main>
  )}