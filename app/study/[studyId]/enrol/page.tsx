"use server"
import Auth from '@/app/_lib/auth'
import AuthServer from '@/app/_lib/auth/ory/service.server'
import { RadarCard } from '@/app/_ui/components/base/card';
import { EnrolmentContent } from '@/app/_ui/enrolment/enrolment';
import { Box, Container } from '@mui/material';

const auth = new Auth();
const authServer = new AuthServer();

export default async function Page({ params }: { params: { studyId: string } }) {
  const content = await authServer.getDisplayName()
  console.log(content)
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <RadarCard>
            <EnrolmentContent />
          </RadarCard>
        </Container>
      </Box>
    </main>
  )}