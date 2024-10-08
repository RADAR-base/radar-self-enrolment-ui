import { SettingsFlow } from "@ory/client"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import QRCode from "react-qr-code"

import { ActionCard, CenterLink, Methods, CardTitle } from "../pkg"
import ory from "../pkg/sdk"
import restSourceClient from "../services/rest-source-client"

interface Props {
  flow?: SettingsFlow
  only?: Methods
}

function AppLoginCard({ children }: Props & { children: ReactNode }) {
  return (
    <ActionCard wide className="cardMargin">
      {children}
    </ActionCard>
  )
}

const Fitbit: NextPage = () => {
  const router = useRouter()
  const DefaultHydraUrl =
    process.env.HYDRA_PUBLIC_URL || "http://localhost:4444"
  const { flow: flowId, return_to: returnTo } = router.query
  const [traits, setTraits] = useState<any>()
  const [projects, setProjects] = useState<any>([])

  const handleNavigation = () => {
    return restSourceClient.redirectToAuthRequestLink()
  }

  useEffect(() => {
    const handleToken = async () => {
      if (!router.isReady) return

      const token = await restSourceClient.getAccessTokenFromRedirect()
      if (token) {
        localStorage.setItem("access_token", token)
        await restSourceClient.redirectToRestSourceAuthLink(token)
      }
    }

    handleToken()
  }, [router.isReady])

  useEffect(() => {
    ory.toSession().then(({ data }) => {
      const traits = data?.identity?.traits
      setTraits(traits)
      setProjects(traits.projects)
    })
  }, [flowId, router, router.isReady, returnTo])

  return (
    <>
      <Head>
        <title>App Login</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <AppLoginCard>
        <CardTitle>App Login</CardTitle>
        <QrForm
          projects={projects}
          baseUrl={DefaultHydraUrl}
          navigate={handleNavigation}
        />
      </AppLoginCard>
      <ActionCard wide>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}

interface QrFormProps {
  projects: any[]
  baseUrl: string
  navigate: any
}

const QrForm: React.FC<QrFormProps> = ({ projects, baseUrl, navigate }) => {
  if (projects) {
    return (
      <div className="center">
        {projects.map((project) => (
          <div key={project.id} className="project-form">
            <h3>{project.name}</h3>
            <div>
              <label className="inputLabel">Connect Your Fitbit</label>
              <p>Click the button below to redirect to Fitbit.</p>
              <button className="col-xs-4" onClick={navigate}>
                Login with Fitbit
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  } else {
    return (
      <div className="center">
        <label className="inputLabel">No projects.</label>
      </div>
    )
  }
}

export default Fitbit
