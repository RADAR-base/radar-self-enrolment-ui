import { IOryRecoveryFlow, IOryErrorFlow } from "@/app/_lib/auth/ory/flows.interface"
import { createRecoveryFlow } from "@/app/_lib/auth/ory/kratos"
import { RecoveryComponent } from "@/app/_ui/auth/recovery"
import { Container, Box } from "@mui/material"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ studyId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
  const flowId = (await searchParams).flowId
  const cookieJar = await cookies()
  const csrfToken = cookieJar.getAll().find((c) => c.name.startsWith('csrf_token_'))
  let flow: IOryRecoveryFlow | IOryErrorFlow | undefined
  
  if ((flowId == undefined) && (csrfToken != undefined)) {
    try {
      const resp = await createRecoveryFlow()
      flow = await resp.json()

    } catch (e) {
      console.log(e)
    }
  }

  if (flow && "state" in flow) {
    flow = flow as IOryRecoveryFlow
  } else {
    console.log(flow as IOryErrorFlow)
    redirect('/' + (await params).studyId)
  }

  return (
    <main>
      <Container maxWidth="lg" disableGutters>
      <Box marginTop={2} marginBottom={2} marginRight={"auto"} marginLeft={"auto"} maxWidth={600} justifySelf={'center'} width='100%'>
          <RecoveryComponent flow={flow}></RecoveryComponent>
        </Box>
      </Container>
    </main>
    )
  }