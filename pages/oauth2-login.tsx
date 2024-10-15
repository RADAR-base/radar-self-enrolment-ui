import axios from "axios"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { MarginCard } from "../pkg"
import ory from "../pkg/sdk"

const OAuth2Login = () => {
  const router = useRouter()
  const [challenge, setChallenge] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [traits, setTraits] = useState<any>(null)
  const [projects, setProjects] = useState<any>([])
  const [id, setId] = useState<any>(null)

  const basePath = process.env.BASE_PATH || "/kratos-ui"

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if a valid Ory Kratos session exists
        const { login_challenge } = router.query
        const { data } = await ory.toSession()
        const traits = data?.identity?.traits
        const projects = traits?.projects
        const id = data?.identity?.id
        setId(data?.identity?.id)
        setTraits(traits)
        setProjects(traits?.projects)
        setChallenge(String(login_challenge))

        if (traits && login_challenge) {
          const subject = projects && projects[0] ? projects[0].userId : id
          handleLogin(subject, login_challenge)
        }
      } catch (error) {
        console.error("Error fetching session:", error)
        const { login_challenge } = router.query
        if (login_challenge) {
          router.push(`/login?login_challenge=${login_challenge}`)
        }
      }
    }

    if (!challenge) {
      checkSession()
    }
  }, [router])

  const handleLogin = async (subject: any, challenge: any) => {
    try {
      if (!subject || !challenge) throw Error("Subject cannot be null")
      const response = await fetch(`${basePath}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginChallenge: challenge,
          subject: subject,
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

  const isLoginReady = traits

  return (
    <div>
      <Head>
        <title>OAuth2 Login</title>
      </Head>
      <MarginCard>
        <h1>OAuth2 Login</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>To continue, please log in.</p>
        <button disabled={!isLoginReady}>
          Loading...
        </button>
        <br />
      </MarginCard>
    </div>
  )
}

export default OAuth2Login
