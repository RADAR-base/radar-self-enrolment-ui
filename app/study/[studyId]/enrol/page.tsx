"use server"
import Auth from '@/app/_lib/auth'
import AuthServer from '@/app/_lib/auth/ory/service.server'
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { RadarCard } from '@/app/_ui/components/base/card';
import { EnrolmentContent } from '@/app/_ui/enrolment/enrolment.component';
import { Box, Container } from '@mui/material';

const auth = new Auth();
const authServer = new AuthServer();

export default async function Page({ params }: { params: { studyId: string } }) {
  const content = await authServer.getDisplayName()
  var registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <RadarCard>
            <EnrolmentContent protocol={protocol.enrolment}/>
          </RadarCard>
        </Container>
      </Box>
    </main>
  )}