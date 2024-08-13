import {
  SettingsFlow,
  UiNode,
  UiNodeInputAttributes,
  UpdateSettingsFlowBody,
} from "@ory/client"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"

import { profileQuestions } from "../data/profile-questionnaire"
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

interface ProfileFormProps {
  questions: any[]
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  profile: any
}

function ProfileCard({ children }: Props & { children: ReactNode }) {
  return (
    <ActionCard wide className="cardMargin">
      {children}
    </ActionCard>
  )
}

const Profile: NextPage = () => {
  const [flow, setFlow] = useState<SettingsFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query
  const [csrfToken, setCsrfToken] = useState<string>("")
  const [traits, setTraits] = useState<any>()
  const [profile, setProfile] = useState<any>({})

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
        setProfile(traits.additional_information || {})
      })
      .catch(handleFlowError(router, "settings", setFlow))
  }, [flowId, router, router.isReady, returnTo, flow])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    })
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const updatedValues: UpdateSettingsFlowBody = {
      csrf_token: csrfToken,
      method: "profile",
      traits: {
        ...traits,
        additional_information: profile,
      },
    }

    return (
      router
        // On submission, add the flow ID to the URL but do not navigate. This prevents the user losing
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
        <title>Profile Page</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <ProfileCard>
        <CardTitle>User Information</CardTitle>
        <ProfileForm
          questions={profileQuestions}
          onSubmit={onSubmit}
          handleChange={handleChange}
          profile={profile}
        />
      </ProfileCard>
      <ActionCard wide>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  questions,
  onSubmit,
  handleChange,
  profile,
}) => {
  return (
    <form method="POST" onSubmit={onSubmit}>
      {questions.map((question, index) => {
        if (question.field_type === "text") {
          return (
            <div key={index}>
              <label className="inputLabel">{question.field_label}</label>
              <input
                className="input"
                id={question.field_name}
                name={question.field_name}
                type="text"
                value={profile[question.field_name] || ""}
                onChange={handleChange}
                required={question.required_field === "yes"}
              />
            </div>
          )
        }
        return null
      })}
      <br />
      <button type="submit">Save</button>
    </form>
  )
}

export default Profile
