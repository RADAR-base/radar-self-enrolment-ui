import { PageRepository, createPageRepository } from "@/app/_lib/study/siteContent/repository";
import { BlockPage } from "@/app/_ui/components/blocks/blockPage";
import ProtocolRepository, { StudyProtocolRepository } from "@/app/_lib/study/protocol/repository";
import { getProjectStatus } from "@/app/_lib/study/projectStatus";
import { notFound } from "next/navigation";

export const dynamicParams = true

export async function generateStaticParams() {
  const registery: StudyProtocolRepository = new ProtocolRepository()
  const studies = registery.getStudies()
  return (await studies).map((id) => Object({studyId: id}))
}

export default async function Page(props: { params: Promise<{ studyId: string }> }) {
  const params = await props.params;

  const projectResult = await getProjectStatus(params.studyId)
  if (projectResult.status === 'not_found') {
    notFound()
  }

  var pageRegistry: PageRepository = createPageRepository()
  const pageContent = await pageRegistry.getLandingPage(params.studyId)
  return (
    <main>
      <BlockPage blockParams={pageContent.blocks} ></BlockPage>
    </main>
  )
}