import PageRepository from '@/app/_lib/study/siteContent/repository';
import { RadarCard } from '@/app/_ui/components/base/card';
import { Box, Container } from '@mui/material';

// export const dynamicParams = false



// export async function generateStaticParams() {
//   // study repo
//   const pageRepo: PageRepository = new PageRepository()
//   const studyIds = ['paprka']
//   var params: {studyId: string, customPage: string[]}[] = []
//   // for (let i = 0; i < studyIds.length; i++) {
//   //   let pageRoutes = await pageRepo.getAllPageRoutes(studyIds[i])
//   //   for (let j = 0; i < pageRoutes.length; j++) {
//   //     params.push({studyId: studyIds[i], customPage: pageRoutes[j]})
//   //   }
//   // }

//   return [
//     {'studyId': 'paprka', 'customPage': ['hello']},
//     {'studyId': 'paprka', 'customPage': ['asd']},
//     {'studyId': 'paprka', 'customPage': ['asd2']},

//   ]
// }

export default async function Page({ params }: { params: { studyId: string, customPage: string[]} }) {
  const pageContent = null;
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <RadarCard>
            {params.customPage}
          </RadarCard>
        </Container>
      </Box>
    </main>
  )}