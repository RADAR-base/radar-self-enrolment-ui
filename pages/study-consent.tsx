import {
  SettingsFlow,
  UiNodeInputAttributes,
  UpdateSettingsFlowBody,
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

function StudyConsentCard({ children }: Props & { children: ReactNode }) {
  return (
    <ActionCard wide className="cardMargin">
      {children}
    </ActionCard>
  )
}

const StudyConsent: NextPage = () => {
  const [flow, setFlow] = useState<SettingsFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query
  const [csrfToken, setCsrfToken] = useState<string>("")
  const [traits, setTraits] = useState<any>()
  const [projects, setProjects] = useState<any>([])

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
        const csrfTokenFromHeaders = (
          data.ui.nodes.find(
            (node: any) => node.attributes.name === "csrf_token",
          )?.attributes as UiNodeInputAttributes
        ).value
        const traits = data.identity.traits
        setCsrfToken(csrfTokenFromHeaders || "")
        setTraits(traits)
        setProjects(traits.projects)
      })
      .catch(handleFlowError(router, "settings", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    projectId: string | null,
  ) => {
    const { name, checked } = event.target

    setProjects((prevProjects: any[]) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            consent: {
              ...project.consent,
              [name]: String(checked),
            },
          }
        }
        return project
      }),
    )
  }

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    projectId: string | null,
  ) => {
    event.preventDefault()
    const updatedValues: UpdateSettingsFlowBody = {
      csrf_token: csrfToken,
      method: "profile",
      traits: {
        ...traits,
        projects,
      },
    }

    return (
      router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user losing
        // their data when they reload the page.
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
        <meta name="description" content="RADAR-base SEP" />
      </Head>
      <StudyConsentCard>
        <CardTitle>Study Consent</CardTitle>
        <ConsentForm
          questions={consentQuestions}
          onSubmit={onSubmit}
          handleChange={handleChange}
          projects={projects}
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

interface ConsentFormProps {
  questions: any[]
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    projectId: string | null,
  ) => void
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    projectId: string | null,
  ) => void
  projects: any[]
}

const ConsentForm: React.FC<ConsentFormProps> = ({
  questions,
  onSubmit,
  handleChange,
  projects,
}) => {
  return (
    <div className="center">
      {projects.map((project) => (
        <div key={project.id} className="project-form">
          <h3>{project.name}</h3>
          {questions.map((question, index) => {
            if (question.field_type === "info") {
              return (
                question.select_choices_or_calculations instanceof Array &&
                question.select_choices_or_calculations.map(
                  (info: any, idx: number) => (
                    <div key={`${index}-${idx}`}>
                      <label className="inputLabel">{info.code}</label>
                      <div className="inner-card">{info.label}</div>
                      <br />
                    </div>
                  ),
                )
              )
            } else if (question.field_type === "checkbox") {
              return (
                <form
                  key={index}
                  method="POST"
                  onSubmit={(event) => onSubmit(event, project.id)}
                >
                  <div className="consent-form">
                    <input
                      className="checkbox"
                      id={question.field_name}
                      name={question.field_name}
                      type="checkbox"
                      checked={
                        project.consent &&
                        project.consent[question.field_name] === "true"
                      }
                      onChange={(event) => handleChange(event, project.id)}
                    />
                    <br />
                    <br />
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
      ))}
    </div>
  )
}

export default StudyConsent
