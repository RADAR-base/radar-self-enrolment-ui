import { IOryRecoveryFlow, IOryErrorFlow } from "@/app/_lib/auth/ory/flows.interface"
import {createRecoveryFlow, getRecoveryFlow} from "@/app/_lib/auth/ory/kratos"
import { RecoveryPageComponent } from "@/app/_ui/auth/recovery/page"
import { Container, Box } from "@mui/material"
import { cookies } from "next/headers"

export default async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ studyId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
  const flowId = (await searchParams).flow
  const token = (await searchParams).token
  const cookieJar = await cookies()
  const csrfToken = cookieJar.getAll().find((c) => c.name.startsWith('csrf_token_'))
  let flow: IOryRecoveryFlow | undefined

  if ((flowId == undefined) && (csrfToken != undefined)) {
    try {
      const resp = await createRecoveryFlow()
      flow = await resp.json()
    } catch (e) {
      console.log(e)
    }
  } else if (flowId) {
    try {
      const resp = await getRecoveryFlow(flowId.toString(), token?.toString())
      flow = await resp.json()
    } catch (e) {
      console.log(e)
    }
  }

  if (flow && "state" in flow) {
    flow = flow as IOryRecoveryFlow
  } else {
    console.log("Invalid flow or error occurred: " + JSON.stringify(flow))
  }

  return (
    <main>
      <Container maxWidth="lg" disableGutters>
      <Box marginTop={2} marginBottom={2} marginRight={"auto"} marginLeft={"auto"} maxWidth={600} justifySelf={'center'} width='100%'>
          <RecoveryPageComponent flow={flow}></RecoveryPageComponent>
        </Box>
      </Container>
    </main>
    )
  }
