import {
  SettingsFlow,
  UpdateSettingsFlowBody,
  UpdateSettingsFlowWithProfileMethod,
} from "@ory/client"
import { H3, P } from "@ory/themes"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"

import {
  ActionCard,
  CenterLink,
  Flow,
  Messages,
  Methods,
  CardTitle,
  InnerCard,
} from "../pkg"
import { handleFlowError } from "../pkg/errors"
import ory from "../pkg/sdk"

interface Props {
  flow?: SettingsFlow
  only?: Methods
}

function SettingsCard({
  flow,
  only,
  children,
}: Props & { children: ReactNode }) {
  if (!flow) {
    return null
  }

  const nodes = only
    ? flow.ui.nodes.filter(({ group }) => group === only)
    : flow.ui.nodes

  if (nodes.length === 0) {
    return null
  }

  return <ActionCard wide>{children}</ActionCard>
}

const Consent: NextPage = () => {
  const [flow, setFlow] = useState<SettingsFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query
  const [csrfToken, setCsrfToken] = useState<string>("")
  const [traits, setTraits] = useState<any>()
  const [consent, setConsent] = useState<any>()

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, "settings", setFlow))
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserSettingsFlow({
        returnTo: String(returnTo || ""),
      })
      .then(({ data }) => {
        setFlow(data)
        const csrfTokenFromHeaders = data.ui.nodes.find(
          (node: any) => node.attributes.name === "csrf_token",
        )?.attributes.value
        const traits = data.identity.traits
        setCsrfToken(csrfTokenFromHeaders || "")
        setTraits(traits)
        setConsent(traits.consent)
      })
      .catch(handleFlowError(router, "settings", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  const handleChange = (event) => {
    setConsent({ has_consent: String(event.target.checked) })
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const updatedValues = {
      csrf_token: csrfToken,
      method: "profile",
      traits: {
        ...traits,
        consent,
      },
    }

    return (
      router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
        // his data when she/he reloads the page.
        .push(`/`)
        .then(() =>
          ory
            .updateSettingsFlow({
              flow: String(flow?.id),
              updateSettingsFlowBody: updatedValues,
            })
            .then(({ data }) => {
              // The settings have been saved and the flow was updated. Let's show it to the user!
              setFlow(data)

              if (data.return_to) {
                window.location.href = data.return_to
                return
              }
            })
            .catch(handleFlowError(router, "consent", setFlow))
            .catch(async (err: AxiosError) => {
              // If the previous handler did not catch the error it's most likely a form validation error
              if (err.response?.status === 400) {
                // Yup, it is!
                setFlow(err.response?.data)
                return
              }

              return Promise.reject(err)
            }),
        )
    )
  }

  return (
    <>
      <Head>
        <title>Study Consent</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <CardTitle style={{ marginTop: 80 }}></CardTitle>
      <SettingsCard only="profile" flow={flow}>
        <CardTitle>Study Consent</CardTitle>

        <div className="center">
          <label className="inputLabel">Patient Information Sheet</label>
          <InnerCard>
            We invite you to take part in this research study. This Participant
            Information Questionnaire will explain the study to help you decide
            whether you want to take part. It is entirely up to you whether or
            not to join the study.
          </InnerCard>
          <label className="inputLabel">Data Information</label>
          <InnerCard>
            If you join the study you will contribute to research that might
            help find ways to improve health and medical care. However, taking
            part does not give direct benefits. You will be able to see the data
            being recorded each day, to give you information on your activity
            and mobility.
          </InnerCard>
          <form method="POST" onSubmit={onSubmit}>
            <div className="consent-form">
              <input
                className="checkbox"
                id="has_consent"
                name="has_consent"
                type="checkbox"
                checked={consent?.has_consent == "true"}
                onChange={handleChange}
              />
              <label className="inputLabel inputLabelCheck">
                I give my consent to take part in this study.
              </label>
            </div>
            <br></br>
            <button type="submit">Save</button>
          </form>
        </div>
      </SettingsCard>
      <ActionCard wide>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}

export default Consent
