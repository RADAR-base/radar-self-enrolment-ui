import PageRepository from '@/app/_lib/study/siteContent/repository';
import { RadarCard } from '@/app/_ui/components/base/card';
import { BlockPage } from '@/app/_ui/components/blocks/blockPage';
import { Box, Container } from '@mui/material';

export const dynamicParams = false

export async function generateStaticParams() {
  // study repo
  const pageRepo: PageRepository = new PageRepository()
  const studyIds = ['paprka']
  var params: {studyId: string, customPage: string[]}[] = []
  for (let i = 0; i < studyIds.length; i++) {
    let pageRoutes = await pageRepo.getAllPageRoutes(studyIds[i])
    for (let j = 0; j < pageRoutes.length; j++) {
      params.push({studyId: studyIds[i], customPage: pageRoutes[j]})
    }
  }
  return params
}

export default async function Page({ params }: { params: { studyId: string, customPage: string[]} }) {
  const pageRepo: PageRepository = new PageRepository()
  const pageContent = await pageRepo.getPage(params.studyId, params.customPage);
  return (
    <main>
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
          <BlockPage blockParams={pageContent.blocks} ></BlockPage>
        </Container>
      </Box>
    </main>
  )}