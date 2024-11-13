"use server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { RadarCard } from '@/app/_ui/components/base/card';
import { RadarTaskCard } from '@/app/_ui/components/portal/taskCard';
import { Box, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function Page({ params }: { params: { studyId: string } }) {
  var registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)

  const items = protocol.protocols.map((item) => <RadarTaskCard metadata={item.metadata} />)
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: 2}} 
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <Grid container spacing={2} gridAutoColumns={'3lf'} gridAutoFlow={"column"}>
            {items.map((card) => (
              <Grid size={{xs: 12, sm: 6, md: 4}}>
                {card}
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </main>
  )}