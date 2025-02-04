import { createRecoveryFlow } from "@/app/_lib/auth/ory/kratos"
import { RecoveryComponent } from "@/app/_ui/auth/recovery"
import { Container, Box } from "@mui/material"

export default async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ studyId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
  const flowId = (await searchParams).flowId
  let flow: IOryRecoveryFlow | undefined
  if (flowId == undefined) {
    const resp = await createRecoveryFlow()
    flow = await resp.json() as IOryRecoveryFlow
  }
  return (
    <main>
      <Container maxWidth="lg" disableGutters>
        <Box marginTop={2} marginBottom={2} maxWidth={600} justifySelf={'center'} width='100%'>
          <RecoveryComponent flow={flow}></RecoveryComponent>
        </Box>
      </Container>
    </main>
    )
  }