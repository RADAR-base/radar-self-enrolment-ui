import { SettingsFlow } from "@ory/client"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import QRCode from "react-qr-code"

import { ActionCard, CenterLink, Methods, CardTitle } from "../pkg"
import ory from "../pkg/sdk"
import armtClient from "../services/armt-client"

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

const Armt: NextPage = () => {
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query
  const [traits, setTraits] = useState<any>()
  const [projects, setProjects] = useState<any>([])
  const [tokenHandled, setTokenHandled] = useState(false)
  const [isFetchingToken, setIsFetchingToken] = useState(false) // Prevent multiple calls
  const [isMobile, setIsMobile] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null) // New state to store the URL for QR code

  const handleNavigation = () => {
    return armtClient.redirectToAuthRequestLink()
  }

  const isMobileDevice = () => {
    return typeof window !== "undefined" && /Mobi|Android/i.test(window.navigator.userAgent)
  }

  useEffect(() => {
    setIsMobile(isMobileDevice())

    ory.toSession().then(({ data }) => {
      const traits = data?.identity?.traits
      setTraits(traits)
      setProjects(traits.projects)
    })
  }, [flowId, router, router.isReady, returnTo])

  useEffect(() => {
    const handleToken = async () => {
      if (!router.isReady || !projects.length || tokenHandled || isFetchingToken) return

      // Token is either missing or expired; fetch a new one
      setIsFetchingToken(true)
      try {
        const tokenResponse = await armtClient.getAccessTokenFromRedirect()
        if (tokenResponse?.access_token && tokenResponse?.expires_in) {
          tokenResponse['iat'] =  Math.floor(Date.now() / 1000)
          const shortToken = { 
            iat: tokenResponse.iat, 
            expires_in: tokenResponse.expires_in, 
            refresh_token: tokenResponse.refresh_token, 
            scope: tokenResponse.scope, 
            token_type: tokenResponse.token_type }

          const url = await armtClient.getAuthLink(
            shortToken,
            projects[0]
          )
          setQrCodeUrl(url)
          if (isMobile) {
            window.location.href = url
          }
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
          qrCodeUrl={qrCodeUrl} // Pass the QR code URL to the form
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
  qrCodeUrl: string | null
}

const QrForm: React.FC<QrFormProps> = ({ projects, navigate, qrCodeUrl }) => {
  if (projects) {
    return (
      <div className="center">
        {projects.map((project) => (
          <div key={project.id} className="project-form">
            <h3>{project.name}</h3>
            <div>
              <label className="inputLabel">Connect Your App</label>
              <p>Click the button below to redirect to login.</p>
              <button className="col-xs-4" onClick={navigate}>
                Login with the aRMT app
              </button>
              <br/>
              <br/>
              <p>Or scan to login.</p>
              {qrCodeUrl && <QRCode value={qrCodeUrl} size={300} />}
              <br />
              <br />
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

export default Armt