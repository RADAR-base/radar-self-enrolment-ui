import { IOryVerificationFlow } from "@/app/_lib/auth/ory/flows.interface"
import { completeVerificationFlow, createRecoveryFlow, createVerificationFlow, getVerificationFlow, whoAmI } from "@/app/_lib/auth/ory/kratos"
import { OrySession } from "@/app/_lib/auth/ory/types"
import { getCsrfToken } from "@/app/_lib/auth/ory/util"
import { VerificationComponent } from "@/app/_ui/auth/verification"
import { Container, Box } from "@mui/material"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const fetchCache = 'force-no-store';

async function getUserSession() {
  const userResponse = await whoAmI()

  if (userResponse.ok) {
    return (await userResponse.json()) as OrySession
  }
  return undefined
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ studyId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const userSession: OrySession | undefined = await getUserSession()
  if (userSession == undefined) {
    redirect('/' + (await params).studyId)
  }
  const cookieJar = await cookies()
  const csrfToken = cookieJar.getAll().find((c) => c.name.startsWith('csrf_token_'))
  const flowId = (await searchParams).flow
  let flow: IOryVerificationFlow | undefined
  if (csrfToken != undefined) {
    try {
      if (flowId == undefined) {
        const resp = await createVerificationFlow()
        flow = await resp.json() as IOryVerificationFlow
        let userEmail = userSession.identity.traits.email
        if (userEmail) {
          const resp2 = await completeVerificationFlow(flow.id, {email: userEmail, csrf_token: getCsrfToken(flow), method: 'code'})
          if (resp2.ok) {
            flow = await resp2.json() as IOryVerificationFlow
          }
        }
      } else {
        const resp = await getVerificationFlow(flowId.toString())
        flow = await resp.json() as IOryVerificationFlow
      }
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <main>
      <Container maxWidth="lg" disableGutters>
        <Box marginTop={2} marginBottom={2} marginRight={"auto"} marginLeft={"auto"} maxWidth={600} justifySelf={'center'} width='100%'>
          <VerificationComponent flow={flow} />
        </Box>
      </Container>
    </main>
    )
  }