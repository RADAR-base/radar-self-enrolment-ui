"use server"
import { Box, Container } from '@mui/material';
import { RadarCard } from '@/app/_ui/components/base/card';
import Grid from '@mui/material/Grid2';
import LoginComponent from '@/app/_ui/auth/login';
import { redirect  } from 'next/navigation'
import { withBasePath } from '@/app/_lib/util/links';


export default async function Page({ params }: { params: { studyId: string } }) {
  return (
    <main>
      <Container maxWidth="lg" disableGutters>
        <Box marginTop={2} marginBottom={2} maxWidth={600} justifySelf={'center'} width='100%'>
          <RadarCard>
            <Box padding={4}>
              <LoginComponent redirectTo={withBasePath('/' + params.studyId)} />
            </Box>
          </RadarCard>
      </Box>
      </Container>
    </main>
  )}