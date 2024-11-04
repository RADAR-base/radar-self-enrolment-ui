import { SettingsFlow } from "@ory/client"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import QRCode from "react-qr-code"
import getConfig from "next/config"

import { ActionCard, CenterLink, Methods, CardTitle } from "../pkg"
import ory from "../pkg/sdk"

const { publicRuntimeConfig } = getConfig()

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

const Apps: NextPage = () => {
  const router = useRouter()
  const DefaultHydraUrl = publicRuntimeConfig.hydraPublicUrl
  const { flow: flowId, return_to: returnTo } = router.query
  const [traits, setTraits] = useState<any>()
  const [projects, setProjects] = useState<any>([])

  const handleNavigation = () => {
    router.replace("/fitbit")
  }

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady) {
      return
    }

    // Otherwise we initialize it
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
        <meta name="description" content="RADAR-base SEP" />
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
            <label className="inputLabel">Active App</label>
            <p>Scan the QR code below with your app.</p>
            <QRCode value={baseUrl + "?projectId=" + project.id} size={140} />
            <br />
            <br />
            <button className="col-xs-4">Login with Active App</button>
            <br />
            <br />
            <br />
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

export default Apps
