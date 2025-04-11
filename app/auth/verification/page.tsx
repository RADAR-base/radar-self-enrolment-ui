import { completeVerificationFlow, createRecoveryFlow, createVerificationFlow, getVerificationFlow, whoAmI } from "@/app/_lib/auth/ory/kratos"
import { getCsrfToken } from "@/app/_lib/auth/ory/util"
import { VerificationComponent } from "@/app/_ui/auth/verification"
import { Container, Box } from "@mui/material"
import { cookies } from "next/headers"
import { OrySession } from "@/app/_lib/auth/ory/types"
import { redirect } from "next/navigation"
import { IOryVerificationFlow } from "@/app/_lib/auth/ory/flows.interface"

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
  params: Promise<{}>
  searchParams: Promise<{ flow?: string, code?: string, flowId?: string }>
}) {
  const userSession: OrySession | undefined = await getUserSession()
  if (userSession == undefined) {
    redirect('/')
  }

  const cookieJar = cookies()
  const csrfToken = cookieJar.getAll().find((c) => c.name.startsWith('csrf_token_'))
  const sp = await searchParams
  const flowId = sp.flowId ?? sp.flow
  if (userSession.identity.traits.projects.length > 0) {
    let redirectUri = `/${userSession.identity.traits.projects[0].id}/verification`
    if (flowId) {
      redirect(`${redirectUri}?flow=${flowId}`)
    }
    redirect(redirectUri)
  }

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
        <Box marginTop={2} marginBottom={2} maxWidth={600} justifySelf={'center'} width='100%'>
          <VerificationComponent flow={flow} />
        </Box>
      </Container>
    </main>
    )
  }