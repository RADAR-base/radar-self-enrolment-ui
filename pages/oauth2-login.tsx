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
  const [traits, setTraits] = useState<any>()
  const [projects, setProjects] = useState<any>([])
  const [redirect, setRedirect] = useState<any>(null)

  const basePath = process.env.BASE_PATH || "/kratos-ui"

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await ory.toSession()
        const traits = data?.identity?.traits
        setTraits(traits)
        setProjects(traits.projects)

        if (!traits || !traits.projects || traits.projects.length === 0) {
          console.log(redirect)
          const currentUrl = window.location.href // Get the current page URL for return_to
          router.push(`/login?return_to=${redirect}`)
          return
        }
      } catch (error) {
        console.error("Error fetching session:", error)
        // Handle session fetch error, possibly redirect to login
        router.push("/login")
      }
    }

    checkSession()
  }, [router])

  useEffect(() => {
    // Get the login challenge from the query parameters
    const { login_challenge, redirect_to } = router.query
    if (login_challenge) {
      setChallenge(String(login_challenge))
    }
    if (redirect_to) {
      console.log(redirect_to)
      setRedirect(redirect_to)
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
