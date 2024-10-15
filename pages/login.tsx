import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import {
  ActionCard,
  CenterLink,
  LogoutLink,
  Flow,
  MarginCard,
  CardTitle,
} from "../pkg"
import { handleGetFlowError, handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"

const Login: NextPage = () => {
  const [flow, setFlow] = useState<LoginFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const {
    return_to: returnTo,
    flow: flowId,
    // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
    // of a user.
    refresh,
    // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
    // to perform two-factor authentication/verification.
    aal,
    login_challenge: loginChallenge,
  } = router.query

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!
  const onLogout = LogoutLink([aal, refresh])

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getLoginFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleGetFlowError(router, "login", setFlow))
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserLoginFlow({
        refresh: loginChallenge ? true : Boolean(refresh),
        aal: aal ? String(aal) : undefined,
        returnTo: returnTo ? String(returnTo) : undefined,
        loginChallenge: loginChallenge ? String(loginChallenge) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, "login", setFlow))
  }, [
    flowId,
    router,
    router.isReady,
    aal,
    refresh,
    returnTo,
    loginChallenge,
    flow,
  ])

  const onSubmit = (values: UpdateLoginFlowBody) =>
    router
      .push(`/login?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateLoginFlow({
            flow: String(flow?.id),
            updateLoginFlowBody: values,
          })
          .then(() => {
            if (flow?.return_to) {
              window.location.href = flow.return_to
            } else if (loginChallenge) {
              window.location.href = `/oauth2/auth/requests/login?login_challenge=${loginChallenge}`
            } else {
              router.push("/")
            }
          })
          .then(() => {})
          .catch(handleFlowError(router, "login", setFlow))
          .catch((err: AxiosError) => {
            if (err.response?.status === 400) {
              setFlow(err.response?.data as LoginFlow)
              return
            }

            return Promise.reject(err)
          }),
      )

  return (
    <>
      <Head>
        <title>Sign in - RADAR Base</title>
        <meta name="description" content="RADAR-base SEP" />
      </Head>
      <MarginCard>
        <CardTitle>
          {(() => {
            if (flow?.refresh) {
              return "Confirm Action"
            } else if (flow?.requested_aal === "aal2") {
              return "Two-Factor Authentication"
            }
            return "Sign In"
          })()}
        </CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      {aal || refresh ? (
        <ActionCard>
          <CenterLink data-testid="logout-link" onClick={onLogout}>
            Log out
          </CenterLink>
        </ActionCard>
      ) : (
        <>
          <ActionCard>
            <Link href="/registration" passHref>
              <CenterLink>Create account</CenterLink>
            </Link>
          </ActionCard>
          <ActionCard>
            <Link href="/recovery" passHref>
              <CenterLink>Recover your account</CenterLink>
            </Link>
          </ActionCard>
        </>
      )}
    </>
  )
}

export default Login
