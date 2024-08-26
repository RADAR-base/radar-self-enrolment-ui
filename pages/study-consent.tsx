import {
  SettingsFlow,
  UiNodeInputAttributes,
  UpdateSettingsFlowBody,
  UpdateSettingsFlowWithProfileMethod,
} from "@ory/client"
import { H3, P } from "@ory/themes"
import { AxiosError } from "axios"
import type { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { MutableRefObject, ReactNode, useEffect, useState } from "react"

import { REMOTE_DEFINITIONS_CONFIG } from "../config/github-config"
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
import FormattedExcpetion from "../pkg/ui/FormattedExcpetion"
import githubService from "../services/github-service"
import { ContentLengthError } from "../utils/errors/ContentLengthError"
import { GithubApiError } from "../utils/errors/GithubApiError"
import { NoContentError } from "../utils/errors/NoContentError"
import { Definition } from "../utils/structures"

interface Props {
  flow?: SettingsFlow
  only?: Methods
}

interface StudyConsentPageProps {
  definitions: string
  exceptionMessage: string
  exceptionStatusCode: number
}

function StudyConsentCard({ children }: Props & { children: ReactNode }) {
  return (
    <ActionCard wide className="cardMargin">
      {children}
    </ActionCard>
  )
}

const StudyConsent: NextPage<StudyConsentPageProps> = ({
  definitions,
  exceptionMessage,
  exceptionStatusCode,
}) => {
  const [flow, setFlow] = useState<SettingsFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query
  const [csrfToken, setCsrfToken] = useState<string>("")
  const [traits, setTraits] = useState<any>()
  const [consent, setConsent] = useState<any>({})

  const [consentQuestions, setConsentQuestions] = useState<Definition[]>([])

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }
    if (definitions != null) {
      setConsentQuestions(JSON.parse(definitions) as Definition[])
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
        const csrfTokenFromHeaders = (
          data.ui.nodes.find(
            (node: any) => node.attributes.name === "csrf_token",
          )?.attributes as UiNodeInputAttributes
        ).value
        const traits = data.identity.traits
        setCsrfToken(csrfTokenFromHeaders || "")
        setTraits(traits)
        setConsent(traits.consent)
      })
      .catch(handleFlowError(router, "settings", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow, definitions])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConsent({
      ...consent,
      [event.target.name]: String(event.target.checked),
    })
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const updatedValues: UpdateSettingsFlowBody = {
      csrf_token: csrfToken,
      method: "profile",
      traits: {
        ...traits,
        consent,
      },
    }

    if (exceptionMessage) {
      return (
        <FormattedExcpetion tileText="An exception occurred while fetching the project or definitions">
          <p>{exceptionMessage}</p>
          {exceptionStatusCode && <p>Status Code: {exceptionStatusCode}</p>}
        </FormattedExcpetion>
      )
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
            .catch(handleFlowError(router, "settings", setFlow))
            .catch(async (err: AxiosError) => {
              // If the previous handler did not catch the error it's most likely a form validation error
              if (err.response?.status === 400) {
                // Yup, it is!
                setFlow(err.response?.data as SettingsFlow)
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
      <StudyConsentCard>
        <CardTitle>Study Consent</CardTitle>
        <ConsentForm
          questions={consentQuestions}
          onSubmit={onSubmit}
          handleChange={handleChange}
          consent={consent}
        />
      </StudyConsentCard>
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
      {questions.map((question: any, index: number) => {
        if (question.field_type === "info") {
          return (
            question.select_choices_or_calculations instanceof Array &&
            question.select_choices_or_calculations.map(
              (info: any, idx: number) => (
                <div key={`${index}-${idx}`}>
                  <label className="inputLabel">{info.code}</label>
                  <InnerCard>{info.label}</InnerCard>
                </div>
              ),
            )
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
                  checked={consent && consent[question.field_name] === "true"}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { projectId } = context.query

  if (typeof projectId === "string") {
    try {
      const consentDefinitions: string | undefined =
        await githubService.initiateFetch(
          projectId,
          REMOTE_DEFINITIONS_CONFIG.CONSENT_DEFINITION_FILE_NAME_CONTENT,
          REMOTE_DEFINITIONS_CONFIG.CONSENT_VERSION,
        )

      if (consentDefinitions == undefined) return { props: {} }

      return {
        props: {
          definitions: consentDefinitions,
        },
      }
    } catch (error: any) {
      if (
        error instanceof ContentLengthError ||
        error instanceof NoContentError
      ) {
        return {
          props: {
            exceptionMessage: error.message,
          },
        }
      } else if (error instanceof GithubApiError) {
        return {
          props: {
            exceptionMessage: error.message,
            exceptionStatusCode: error.statusCode,
          },
        }
      } else {
        return {
          props: {
            exceptionMessage: error.message,
          },
        }
      }
    }
  } else return { props: {} }
}

export default StudyConsent
