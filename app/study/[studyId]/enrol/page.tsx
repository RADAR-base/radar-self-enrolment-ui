"use server"
import Auth from '@/app/_lib/auth'
import AuthServer from '@/app/_lib/auth/ory/service.server'
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { RadarCard } from '@/app/_ui/components/base/card';
import { EnrolmentContent } from '@/app/_ui/enrolment/enrolment.component';
import { Box, Container } from '@mui/material';

const authServer = new AuthServer();

export default async function Page({ params }: { params: { studyId: string } }) {
  var content = ""
  try {
  content = await authServer.getDisplayName() ?? ''
  }
  catch {
    content = JSON.stringify(process.env)
  }
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
        {content}
      </Box>
    </main>
  )}