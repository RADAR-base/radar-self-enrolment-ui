"use server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { RadarCard } from '@/app/_ui/components/base/card';
import { Box, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function Page({ params }: { params: { studyId: string } }) {
  var registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)

  const items = protocol.protocols.map((item) => <RadarCard>{item.name}</RadarCard>)
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <Grid container spacing={2}>
            {items.map((card) => (
              <Grid size={{xs: 12, sm: 6, md: 4}}>
                {card}
              </Grid>
            ))}
            <Grid size={{xs: 12, sm: 6, md: 4}}>
              {await registery.getStudies()}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </main>
  )}