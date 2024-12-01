"use server"
import { Box, Container } from '@mui/material';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { ArmtDefinitionRepository, getDefinition } from '@/app/_lib/armt/repository/repository';
import { ArmtContent } from '@/app/_ui/components/form/pageContent';
import { RadarCard } from '@/app/_ui/components/base/card';
import {whoAmI} from '@/app/_lib/auth/ory/kratos';
import { DevicesPanel } from '@/app/_ui/portal/devicesPanel';


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

export default async function Page({ params }: { params: { studyId: string} }) {
  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  const armtRepo = new ArmtDefinitionRepository(protocol)
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            style={{marginLeft: "min(4, calc(100vw - 100%))"}}
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <DevicesPanel protocol={protocol}></DevicesPanel>
        </Container>
      </Box>
    </main>
  )}