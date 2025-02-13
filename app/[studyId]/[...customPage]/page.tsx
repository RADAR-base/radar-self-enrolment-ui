import PageRepository from '@/app/_lib/study/siteContent/repository';
import { RadarCard } from '@/app/_ui/components/base/card';
import { BlockPage } from '@/app/_ui/components/blocks/blockPage';
import { Box, Container } from '@mui/material';
import { notFound } from 'next/navigation';

export const dynamicParams = true

export async function generateStaticParams() {
  // study repo
  const pageRepo: PageRepository = new PageRepository()
  const studyIds = await pageRepo.getAllStudyIds()
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
  if (pageContent == undefined) {
    notFound()
  }
  return (
    <main>
          <BlockPage blockParams={pageContent.blocks} ></BlockPage>
    </main>
  )}