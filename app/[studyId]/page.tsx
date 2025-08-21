import { PageRepository, createPageRepository } from "@/app/_lib/study/siteContent/repository";
import { BlockPage } from "@/app/_ui/components/blocks/blockPage";
import ProtocolRepository, { StudyProtocolRepository } from "@/app/_lib/study/protocol/repository";

export const dynamicParams = false

export async function generateStaticParams() {
  const registery: StudyProtocolRepository = new ProtocolRepository()
  const studies = registery.getStudies()
  return (await studies).map((id) => Object({studyId: id}))
}

export default async function Page(props: { params: Promise<{ studyId: string }> }) {
  const params = await props.params;

  var pageRegistry: PageRepository = createPageRepository()
  const pageContent = await pageRegistry.getLandingPage(params.studyId)
  return (
    <main>
      <BlockPage blockParams={pageContent.blocks} ></BlockPage>
    </main>
  )
}