import axios from "axios"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import ory from "../pkg/sdk"
import { MarginCard } from "../pkg"

const OAuth2Login = () => {
  const router = useRouter()
  const [challenge, setChallenge] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [traits, setTraits] = useState<any>()
  const [projects, setProjects] = useState<any>([])

  const basePath = process.env.BASE_PATH || "/kratos-ui"

  useEffect(() => {
    ory.toSession().then(({ data }) => {
      const traits = data?.identity?.traits
      setTraits(traits)
      setProjects(traits.projects) //
    })
  }, [router, router.isReady])

  useEffect(() => {
    // Get the login challenge from the query parameters
    const { login_challenge } = router.query
    if (login_challenge) {
      setChallenge(String(login_challenge))
    }
  }, [router.query])

  const handleLogin = async () => {
    if (!challenge) {
      setError("No login challenge found.")
      return
    }

    try {
      const id = projects[0].userId
      const response = await fetch(`${basePath}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginChallenge: challenge,
          subject: id,
          remember: true,
        }),
      })

      const data = await response.json()
      window.location.href = data.redirect_to
    } catch (err) {
      console.error("Error during login:", err)
      setError("Login failed. Please try again.")
    }
  }

  if (!challenge) {
    return (
      <div>
        <Head>
          <title>OAuth2 Login</title>
        </Head>
        <MarginCard>
        <h1>OAuth2 Login</h1>
        <p>Waiting for login challenge...</p>
        </MarginCard>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>OAuth2 Login</title>
      </Head>
      <MarginCard>
      <h1>OAuth2 Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>To continue, please log in.</p>
      <button onClick={handleLogin}>Log In</button>
      <br />
      <Link href="/">Cancel</Link>
      </MarginCard>
    </div>
  )
}

export default OAuth2Login
