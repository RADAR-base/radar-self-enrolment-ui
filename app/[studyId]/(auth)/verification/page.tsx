import { completeVerificationFlow, createRecoveryFlow, createVerificationFlow, whoAmI } from "@/app/_lib/auth/ory/kratos"
import { getCsrfToken } from "@/app/_lib/auth/ory/util"
import { VerificationComponent } from "@/app/_ui/auth/verification"
import { Container, Box } from "@mui/material"

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ studyId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const userSession = await (await whoAmI()).json()
  const flowId = (await searchParams).flowId
  let flow: IOryVerificationFlow | undefined
  if (flowId == undefined) {
    const resp = await createVerificationFlow()
    flow = await resp.json() as IOryVerificationFlow
    let userEmail = userSession['identity']['traits']['email'] as string
    if (userEmail) {
      const resp2 = await completeVerificationFlow(flow.id, {email: userEmail, csrf_token: getCsrfToken(flow), method: 'code'})
      if (resp2.ok) {
        flow = await resp2.json() as IOryVerificationFlow
      }
    }
  }
  return (
    <main>
      <Container maxWidth="lg" disableGutters>
        <Box marginTop={2} marginBottom={2} maxWidth={600} justifySelf={'center'} width='100%'>
          <VerificationComponent flow={flow} />
        </Box>
      </Container>
    </main>
    )
  }