import { Card, P, H2, H3, CodeBox } from "@ory/themes"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { DocsButton, MarginCard, LogoutLink, CardTitle } from "../pkg"
import ory from "../pkg/sdk"

const Home: NextPage = () => {
  const [session, setSession] = useState<string>(
    "No valid Ory Session was found.\nPlease sign in to receive one.",
  )
  const [hasSession, setHasSession] = useState<boolean>(false)
  const router = useRouter()
  const onLogout = LogoutLink()

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setSession(JSON.stringify(data, null, 2))
        setHasSession(true)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 403:
          // This is a legacy error code thrown. See code 422 for
          // more details.
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // its second factor
            return router.push("/login?aal=aal2")
          case 401:
            // do nothing, the user is not logged in
            return
        }

        // Something else happened!
        return Promise.reject(err)
      })
  }, [router])

  return (
    <div className={"container-fluid"}>
      <Head>
        <title>Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>

      <MarginCard wide>
        <CardTitle>RADAR Base Ory!</CardTitle>
        <P>Welcome to the RADAR Base self-enrolment portal.</P>
        <div className="row">
          <div className="col-md-4 col-xs-12">
            <div className="box">
              <H3>Pages</H3>
              <div className="row">
                <DocsButton
                  testid="study"
                  href="/study"
                  disabled={hasSession}
                  title={"Study"}
                />
                <DocsButton
                  testid="eligibility"
                  href="/eligibility"
                  disabled={hasSession}
                  title={"Eligibility"}
                />
                <DocsButton
                  testid="login"
                  href="/login"
                  disabled={hasSession}
                  title={"Login"}
                />
                <DocsButton
                  testid="sign-up"
                  href="/registration"
                  disabled={hasSession}
                  title={"Sign Up"}
                />
                <DocsButton
                  testid="recover-account"
                  href="/recovery"
                  disabled={hasSession}
                  title="Recover Account"
                />
                <DocsButton
                  testid="verify-account"
                  href="/verification"
                  title="Verify Account"
                />
                <DocsButton
                  testid="consent"
                  href="/consent"
                  title="Study Consent"
                  disabled={!hasSession}
                />
                <DocsButton
                  testid="account-settings"
                  href="/settings"
                  disabled={!hasSession}
                  title={"Account Settings"}
                />
                <DocsButton
                  testid="logout"
                  onClick={onLogout}
                  disabled={!hasSession}
                  title={"Logout"}
                />
              </div>
            </div>
          </div>
          <div className="col-md-8 col-xs-12">
            <div className="box">
              <H3>Session Information</H3>
              <P>
                Below you will find the decoded Ory Session if you are logged
                in.
              </P>
              <CodeBox data-testid="session-content" code={session} className="codebox"/>
            </div>
          </div>
        </div>
      </MarginCard>
    </div>
  )
}

export default Home
