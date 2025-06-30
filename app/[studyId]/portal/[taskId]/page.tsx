"use server"
import { Box, Container } from '@mui/material';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { ArmtDefinitionRepository } from '@/app/_lib/armt/repository/repository';
import { ArmtContent } from '@/app/_ui/components/form/pageContent';
import { RadarCard } from '@/app/_ui/components/base/card';
import { notFound, redirect } from 'next/navigation';
import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { allTaskStatus, getExistingTask } from '@/app/_lib/study/tasks/status';
import { ArmtStatus } from '@/app/api/study/[studyId]/tasks/status/route';
import { withBasePath } from '@/app/_lib/util/links';


// export const dynamicParams = false

// export async function generateStaticParams() {
//   // study repo
//   const pageRepo: PageRepository = new PageRepository()
//   const studyIds = ['paprka']
//   var params: {studyId: string, customPage: string[]}[] = []
//   for (let i = 0; i < studyIds.length; i++) {
//     let pageRoutes = await pageRepo.getAllPageRoutes(studyIds[i])
//     for (let j = 0; j < pageRoutes.length; j++) {
//       params.push({studyId: studyIds[i], customPage: pageRoutes[j]})
//     }
//   }
//   return params
// }

async function isTaskDue(taskId: string, studyId: string): Promise<boolean | undefined> {
  const resp = await whoAmI()
  if (resp.status == 200) {
    const oryUser = await resp.json()
    const userId = oryUser['identity']['id']
    if (userId) {
      const statuses = await allTaskStatus(studyId, userId)
      if (statuses != null) { 
      return statuses[taskId]?.due
      }
    }
  }
}

async function getTask(studyId: string, taskId: string) {
  const resp = await whoAmI()
  if (resp.status == 200) {
    const oryUser = await resp.json()
    const userId = oryUser['identity']['id']
    if (userId) {
      const task = await getExistingTask(studyId, userId, taskId)
      return task
    }
  }
}

export default async function Page(props: { params: Promise<{ studyId: string, taskId: string}> }) {
  const params = await props.params;
  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  if (protocol == undefined) { notFound() }

  const armtRepo = new ArmtDefinitionRepository(protocol)
  const armtDef = await armtRepo.getDefinition(params.taskId)
  if (armtDef == undefined) { return notFound() }

  const taskResponse = await getTask(params.studyId, params.taskId)
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            style={{marginLeft: "min(4, calc(100vw - 100%))"}}
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <RadarCard>
            <ArmtContent 
              studyId={params.studyId} taskId={params.taskId}
              redcapDef={armtDef} disabled={taskResponse != undefined} 
              initialResponse={taskResponse}
            />
          </RadarCard>
        </Container>
      </Box>
    </main>
  )
}