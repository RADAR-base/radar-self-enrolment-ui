"use server"
import { Suspense } from 'react';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { RadarCard } from '@/app/_ui/components/base/card';
import { EnrolmentContent } from '@/app/_ui/enrolment/enrolment.component';
import { Box, Container } from '@mui/material';

import Auth from '@/app/_lib/auth'
import { notFound, redirect } from 'next/navigation'
import { withBasePath } from '@/app/_lib/util/links';
import { getProjectStatus } from '@/app/_lib/study/projectStatus';
import { Typography } from '@mui/material';

export default async function Page(props: { params: Promise<{ studyId: string }> }) {
  const params = await props.params;
  const auth = new Auth()
  const loggedIn = await auth.isLoggedIn()
  if (loggedIn) {redirect(withBasePath('portal'))}

  const projectStatus = await getProjectStatus(params.studyId)
  if (projectStatus && !projectStatus.acceptingEnrolment) {
    return (
      <main>
        <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}}
              display="flex"
              justifyContent="center"
              alignItems="center">
          <Container maxWidth="lg" disableGutters>
            <RadarCard>
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Enrolment Closed</Typography>
                <Typography variant="body1">This study is not currently accepting new participants.</Typography>
              </Box>
            </RadarCard>
          </Container>
        </Box>
      </main>
    )
  }

  var registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  if (protocol == undefined) {
    notFound()
  }
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}}
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <RadarCard>
            <Suspense>
              <EnrolmentContent studyProtocol={protocol}/>
            </Suspense>
          </RadarCard>
        </Container>
      </Box>
    </main>
  )
}