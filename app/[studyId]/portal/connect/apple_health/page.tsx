"use server"
import { Box, Container } from '@mui/material';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import QRCode from 'react-qr-code';
import { RadarCard } from '@/app/_ui/components/base/card';


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
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            style={{marginLeft: "min(4, calc(100vw - 100%))"}}

            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <RadarCard>
            <QRCode value={process.env.HYDRA_PUBLIC_URL + "?projectId=" + params.studyId} size={140} ></QRCode>
          </RadarCard>
        </Container>
      </Box>
    </main>
  )}