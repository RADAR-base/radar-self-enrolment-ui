import { SettingsFlow } from "@ory/client"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"

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
  const { flow: flowId, return_to: returnTo } = router.query
  const [traits, setTraits] = useState<any>()
  const [projects, setProjects] = useState<any>([])
  const [tokenHandled, setTokenHandled] = useState(false)
  const [isFetchingToken, setIsFetchingToken] = useState(false) // Prevent multiple calls

  const handleNavigation = () => {
    return restSourceClient.redirectToAuthRequestLink()
  }

  const isTokenExpired = (expiryTime: string | null) => {
    if (!expiryTime) return true
    return new Date().getTime() > new Date(expiryTime).getTime()
  }

  useEffect(() => {
    ory.toSession().then(({ data }) => {
      const traits = data?.identity?.traits
      setTraits(traits)
      setProjects(traits.projects)
    })
  }, [flowId, router, router.isReady, returnTo])

  useEffect(() => {
    const handleToken = async () => {
      if (!router.isReady || !projects.length || tokenHandled || isFetchingToken) return

      const existingToken = localStorage.getItem("access_token")
      const tokenExpiry = localStorage.getItem("access_token_expiry")

      if (existingToken && !isTokenExpired(tokenExpiry)) {
        await restSourceClient.redirectToRestSourceAuthLink(
          existingToken,
          projects[0]
        )
        setTokenHandled(true)
        return
      }

      // Token is either missing or expired; fetch a new one
      setIsFetchingToken(true)
      try {
        const tokenResponse = await restSourceClient.getAccessTokenFromRedirect()
        if (tokenResponse?.access_token && tokenResponse?.expires_in) {
          const accessToken = tokenResponse.access_token
          const expiryTime = new Date(
            new Date().getTime() + tokenResponse.expires_in * 1000
          ).toISOString()

          localStorage.setItem("access_token", accessToken)
          localStorage.setItem("access_token_expiry", expiryTime)

          await restSourceClient.redirectToRestSourceAuthLink(
            accessToken,
            projects[0]
          )
          setTokenHandled(true)
        }
      } catch (error) {
        console.error("Failed to fetch token:", error)
      } finally {
        setIsFetchingToken(false)
      }
    }

    handleToken()
  }, [router.isReady, projects, tokenHandled, isFetchingToken])

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
  navigate: any
}

const QrForm: React.FC<QrFormProps> = ({ projects, navigate }) => {
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