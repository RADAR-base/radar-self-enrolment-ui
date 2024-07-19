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
import { consentQuestions } from "../data/consent-questionnaire"

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
  return <ActionCard wide>{children}</ActionCard>
}

const Consent: NextPage = () => {
  const [flow, setFlow] = useState<SettingsFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query
  const [csrfToken, setCsrfToken] = useState<string>("")
  const [traits, setTraits] = useState<any>()
  const [consent, setConsent] = useState<any>({})

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
        <ConsentForm
          questions={consentQuestions}
          onSubmit={onSubmit}
          handleChange={handleChange}
          consent={consent}
        />
      </SettingsCard>
      <ActionCard wide>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}

const ConsentForm: React.FC<any> = ({
  questions,
  onSubmit,
  handleChange,
  consent,
}) => {
  return (
    <div className="center">
      {questions.map((question, index) => {
        if (question.field_type === "info") {
          return (
            question.select_choices_or_calculations instanceof Array &&
            question.select_choices_or_calculations.map((info, idx) => (
              <div key={`${index}-${idx}`}>
                <label className="inputLabel">{info.code}</label>
                <InnerCard>{info.label}</InnerCard>
              </div>
            ))
          )
        } else if (question.field_type === "checkbox") {
          return (
            <form key={index} method="POST" onSubmit={onSubmit}>
              <div className="consent-form">
                <input
                  className="checkbox"
                  id={question.field_name}
                  name={question.field_name}
                  type="checkbox"
                  checked={consent[question.field_name] === "true"}
                  onChange={handleChange}
                />
                <label className="inputLabel inputLabelCheck">
                  {question.field_label}
                </label>
              </div>
              <br />
              <button type="submit">Save</button>
            </form>
          )
        }
        return null
      })}
    </div>
  )
}

export default Consent
