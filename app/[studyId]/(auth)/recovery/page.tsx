import { RecoveryPageComponent } from "@/app/_ui/auth/recovery/page"
import { Container, Box } from "@mui/material"

export default async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ studyId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
  return (
    <main>
      <Container maxWidth="lg" disableGutters>
      <Box marginTop={2} marginBottom={2} marginRight={"auto"} marginLeft={"auto"} maxWidth={600} justifySelf={'center'} width='100%'>
          <RecoveryPageComponent  ></RecoveryPageComponent>
        </Box>
      </Container>
    </main>
    )
  }