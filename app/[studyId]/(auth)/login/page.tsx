"use server"
import { Box, Container } from '@mui/material';
import { RadarCard } from '@/app/_ui/components/base/card';
import Grid from '@mui/material/Grid2';
import LoginComponent from '@/app/_ui/auth/login';
import { redirect  } from 'next/navigation'
import { withBasePath } from '@/app/_lib/util/links';
import { createLoginFlow } from '@/app/_lib/auth/ory/kratos';


export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ studyId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {  
  const studyId = (await params).studyId
  const flowId = (await searchParams).flowId
  let flow: IOryLoginFlow | undefined
  if (flowId == undefined) {
    const resp = await createLoginFlow()
    flow = await resp.json() as IOryLoginFlow
  }
  return (
    <main>
      <Container maxWidth="lg" disableGutters>
        <Box marginTop={2} marginBottom={2} maxWidth={600} justifySelf={'center'} width='100%'>
          <RadarCard>
            <Box padding={4}>
              <LoginComponent redirectTo={withBasePath('/' + studyId)} flow={flow} />
            </Box>
          </RadarCard>
      </Box>
      </Container>
    </main>
  )}