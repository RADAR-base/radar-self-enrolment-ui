import { PageRepository, createPageRepository } from "@/app/_lib/study/siteContent/repository";
import { BlockPage } from "@/app/_ui/components/blocks/blockPage";
import ProtocolRepository, { StudyProtocolRepository } from "@/app/_lib/study/protocol/repository";
import fetchProjectsFromMp from "@/app/_lib/github/services/mp-projects-fetcher";
import { notFound } from "next/navigation";
import { Alert, Box, Container } from "@mui/material";

export const dynamicParams = true

export async function generateStaticParams() {
  const registery: StudyProtocolRepository = new ProtocolRepository()
  const studies = registery.getStudies()
  return (await studies).map((id) => Object({studyId: id}))
}

export default async function Page(props: { params: Promise<{ studyId: string }> }) {
  const params = await props.params;

  // Ensure the study exists in Management Portal before rendering
  const projects = await fetchProjectsFromMp()
  const existsInMp = projects.some((p) => p.projectName === params.studyId)
  if (!existsInMp) {
    return (
      <main>
        <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
              display="flex"
              justifyContent="center"
              alignItems="center">
          <Container maxWidth="md">
            <Alert severity="warning" variant="outlined">
              Project "{params.studyId}" does not exist in Management Portal.
            </Alert>
          </Container>
        </Box>
      </main>
    )
  }

  var pageRegistry: PageRepository = createPageRepository()
  const pageContent = await pageRegistry.getLandingPage(params.studyId)
  return (
    <main>
      <BlockPage blockParams={pageContent.blocks} ></BlockPage>
    </main>
  )
}