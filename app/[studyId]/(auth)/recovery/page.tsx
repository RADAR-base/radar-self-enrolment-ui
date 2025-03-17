import { createRecoveryFlow } from "@/app/_lib/auth/ory/kratos"
import { RecoveryComponent } from "@/app/_ui/auth/recovery"
import { Container, Box } from "@mui/material"
import { cookies } from "next/headers"

export default async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ studyId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
  const flowId = (await searchParams).flowId
  const cookieJar = cookies()
  const csrfToken = cookieJar.getAll().find((c) => c.name.startsWith('csrf_token_'))
  let flow: IOryRecoveryFlow | undefined
  
  if ((flowId == undefined) && (csrfToken != undefined)) {
    try {
      const resp = await createRecoveryFlow()
      flow = await resp.json() as IOryRecoveryFlow
    } catch (e) {
      console.log(e)
    }
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