import PageRepository from "@/app/_lib/study/siteContent/repository";
import { BlockPage } from "@/app/_ui/components/blocks/blockPage";
import SignaturePad from "react-signature-pad-wrapper";

export default async function Page({ params }: { params: { studyId: string } }) {
  var pageRegistry: PageRepository = new PageRepository()
  const pageContent = await pageRegistry.getLandingPage(params.studyId)
  return (
    <main>
      <BlockPage blockParams={pageContent.blocks} ></BlockPage>
    </main>
  )}