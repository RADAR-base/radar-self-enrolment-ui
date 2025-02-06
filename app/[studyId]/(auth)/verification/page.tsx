import { completeVerificationFlow, createRecoveryFlow, createVerificationFlow, whoAmI } from "@/app/_lib/auth/ory/kratos"
import { getCsrfToken } from "@/app/_lib/auth/ory/util"
import { VerificationComponent } from "@/app/_ui/auth/verification"
import { Container, Box } from "@mui/material"
import { cookies } from "next/headers"

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ studyId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const userSession = await (await whoAmI()).json()
  const cookieJar = cookies()
  const csrfToken = cookieJar.getAll().find((c) => c.name.startsWith('csrf_token_'))
  const flowId = (await searchParams).flowId
  let flow: IOryVerificationFlow | undefined

  if ((flowId == undefined) && (csrfToken != undefined)) {
    try {
      const resp = await createVerificationFlow()
      flow = await resp.json() as IOryVerificationFlow
      let userEmail = userSession['identity']['traits']['email'] as string
      if (userEmail) {
        const resp2 = await completeVerificationFlow(flow.id, {email: userEmail, csrf_token: getCsrfToken(flow), method: 'code'})
        if (resp2.ok) {
          flow = await resp2.json() as IOryVerificationFlow
        }
      }
    } catch (e) {
      console.log(e)
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