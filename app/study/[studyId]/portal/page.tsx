"use server"
import Auth from '@/app/_lib/auth'
import AuthServer from '@/app/_lib/auth/ory/service.server'
import { LocalProtocolRepository, StudyProtocolRepository } from '@/app/_lib/study/repository';
import { RadarCard } from '@/app/_ui/components/base/card';
import { EnrolmentContent } from '@/app/_ui/enrolment/enrolment.component';
import { Box, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';

const auth = new Auth();
const authServer = new AuthServer();

export default async function Page({ params }: { params: { studyId: string } }) {
  var registery: StudyProtocolRepository = new LocalProtocolRepository()
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
          </Grid>
        </Container>
      </Box>
    </main>
  )}