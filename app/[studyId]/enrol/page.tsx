"use server"
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { RadarCard } from '@/app/_ui/components/base/card';
import { EnrolmentContent } from '@/app/_ui/enrolment/enrolment.component';
import { Box, Container } from '@mui/material';

import Auth from '@/app/_lib/auth'
import { redirect, usePathname } from 'next/navigation'
import { withBasePath } from '@/app/_lib/util/links';

export default async function Page({ params }: { params: { studyId: string } }) {
  const auth = new Auth()
  const loggedIn = await auth.isLoggedIn()
  if (loggedIn) {redirect(withBasePath('portal'))}
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
            <EnrolmentContent studyProtocol={protocol}/>
          </RadarCard>
        </Container>
      </Box>
    </main>
  )}