"use server"
import { Box, Container } from '@mui/material';
import { RadarCard } from '@/app/_ui/components/base/card';
import LoginComponent from '@/app/_ui/auth/login';
import { createLoginFlow } from '@/app/_lib/auth/ory/kratos';
import { cookies, headers } from 'next/headers';
import { IOryLoginFlow } from '@/app/_lib/auth/ory/flows.interface';

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ studyId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {  
  const studyId = (await params).studyId
  const flowId = (await searchParams).flowId
  const redirectTo = (await searchParams).redirectTo?.toString() ?? ('/' + studyId + '/portal')
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

  const headerList = await headers();
  const referer = headerList.get('referer')

  return (
    <main>
      <Container maxWidth="lg" disableGutters>
        <Box marginTop={2} marginBottom={2} marginRight={"auto"} marginLeft={"auto"} maxWidth={600} justifySelf={'center'} width='100%'>
          <RadarCard>
            <Box padding={4}>
              <LoginComponent redirectTo={redirectTo} flow={flow} />
            </Box>
          </RadarCard>
      </Box>
      </Container>
    </main>
  )}