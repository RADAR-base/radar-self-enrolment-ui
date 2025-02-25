"use server"
import { IOrySettingsFlow } from '@/app/_lib/auth/ory/flows.interface';
import { createSettingsFlow, getSettingsFlow } from '@/app/_lib/auth/ory/kratos';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import SettingsComponent from '@/app/_ui/auth/settings';
import { RadarCard } from '@/app/_ui/components/base/card';
import { Download } from '@mui/icons-material';
import { Box, Container } from '@mui/material';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ studyId: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {  
  const studyId = (await params).studyId
  const flowId = (await searchParams).flow
  const cookieJar = cookies()
  const csrfToken = cookieJar.getAll().find((c) => c.name.startsWith('csrf_token_'))
  let flow: IOrySettingsFlow | undefined

  if (csrfToken != undefined) {
    if (flowId == undefined) {
      try {
        const resp = await createSettingsFlow()
        flow = await resp.json() as IOrySettingsFlow
      } catch (e) {
        console.log(e)
      }
    } else {
      const resp = await getSettingsFlow(flowId)
      flow = await resp.json() as IOrySettingsFlow
    }
  }

  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(studyId)
  if (protocol == undefined) { notFound() }
  return ( 
      <main>
        <Container maxWidth="lg" disableGutters>
          <Box marginTop={2} marginBottom={2} marginRight={"auto"} marginLeft={"auto"} maxWidth={600} justifySelf={'center'} width='100%'>
            <RadarCard>
              <Box padding={4}>
              <SettingsComponent redirectTo={`/${studyId}/portal`} flow={flow} />
              </Box>
            </RadarCard>
        </Box>
        </Container>
      </main>
  )
}