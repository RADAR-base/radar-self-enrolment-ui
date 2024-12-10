import PageRepository from "@/app/_lib/study/siteContent/repository";
import { BlockPage } from "@/app/_ui/components/blocks/blockPage";
import ProtocolRepository from "@/app/_lib/study/protocol/repository";

export const dynamicParams = true

export async function generateStaticParams() {
  const registery = new ProtocolRepository()
  return await (registery.getStudies().then(studies => studies.map((id) => {studyId: id})))
}

export default async function Page({ params }: { params: { studyId: string } }) {
  var pageRegistry: PageRepository = new PageRepository()
  const pageContent = await pageRegistry.getLandingPage(params.studyId)
  return (
    <main>
      <BlockPage blockParams={pageContent.blocks} ></BlockPage>
    </main>
  )}