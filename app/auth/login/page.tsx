"use server"
import { Box, Container } from '@mui/material';
import { RadarCard } from '@/app/_ui/components/base/card';
import Grid from '@mui/material/Grid2';
import LoginComponent from '@/app/_ui/auth/login';
import { redirect  } from 'next/navigation'
import { withBasePath } from '@/app/_lib/util/links';
import { createLoginFlow } from '@/app/_lib/auth/ory/kratos';
import { cookies } from 'next/headers';
import { IOryLoginFlow } from '@/app/_lib/auth/ory/flows.interface';


export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ studyId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {  
  const flowId = (await searchParams).flowId
  const cookieJar = await cookies()
  const csrfToken = cookieJar.getAll().find((c) => c.name.startsWith('csrf_token_'))
  let flow: IOryLoginFlow | undefined
  if ((flowId == undefined) && (csrfToken != undefined)) {
    try {
      const resp = await createLoginFlow()
      flow = await resp.json() as IOryLoginFlow
    } catch (e) {
      console.log(e)
    }
  }
  const redirectTo = (await searchParams).redirect_to?.toString() ?? withBasePath('/')

  return (
    <main>
      <Container maxWidth="lg" disableGutters>
        <Box marginTop={2} marginBottom={2} maxWidth={600} justifySelf={'center'} width='100%'>
          <RadarCard>
            <Box padding={4}>
              <LoginComponent redirectTo={redirectTo} flow={flow} />
            </Box>
          </RadarCard>
      </Box>
      </Container>
    </main>
  )}