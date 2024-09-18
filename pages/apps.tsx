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
import QRCode from "react-qr-code"

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
import { H3 } from "@ory/themes"

interface Props {
  flow?: SettingsFlow
  only?: Methods
}

function ProfileCard({ children }: Props & { children: ReactNode }) {
  return (
    <ActionCard wide className="cardMargin">
      {children}
    </ActionCard>
  )
}

const Apps: NextPage = () => {
  const [flow, setFlow] = useState<SettingsFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const DefaultHydraUrl = "http://localhost:4444"

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady) {
      return
    }
  }, [])

  return (
    <>
      <Head>
        <title>App Login</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <ProfileCard>
        <CardTitle>App Login</CardTitle>
        <div className="center">
          <p>Scan the QR code below with your app.</p>
          <QRCode value={DefaultHydraUrl} size={140} />
        </div>
      </ProfileCard>
      <ActionCard wide>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}

export default Apps
