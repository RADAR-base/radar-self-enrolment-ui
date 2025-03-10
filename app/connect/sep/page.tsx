"use client"
import { withBasePath } from "@/app/_lib/util/links"
import crypto from "crypto"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const CLIENT_ID = process.env.SEP_CLIENT_ID ?? 'SEP'
const RETURN_TO_STORAGE_PATH = 'connect_sep_return_to'
const STATE_STORAGE_PATH = 'connect_sep_state'

export default function Page() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const returnedState = searchParams.get('state')
  const [authUrl, setAuthUrl] = useState<string | null>(null)

  // Fetch the dynamic auth URL from the API
  async function fetchAuthLink() {
    const state = crypto.randomBytes(20).toString('hex')
    const return_to = searchParams.get('return_to')
    try {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        state: state,
      }).toString()

      const res = await fetch(withBasePath(`/api/auth/request?${params}`))
      const data = await res.json()

      if (data.authUrl) {
        localStorage.setItem(RETURN_TO_STORAGE_PATH, return_to ?? '/')
        localStorage.setItem(STATE_STORAGE_PATH, state)
        setAuthUrl(data.authUrl)
      } else {
        console.error('Failed to get auth URL')
      }
    } catch (error) {
      console.error('Error fetching auth URL:', error)
    }
  }

  useEffect(() => {
    if (code == null) {
      fetchAuthLink()
    } else {
      const return_to = localStorage.getItem(RETURN_TO_STORAGE_PATH) ?? '/'
      const storedState = localStorage.getItem(STATE_STORAGE_PATH)

      localStorage.removeItem(RETURN_TO_STORAGE_PATH)
      localStorage.removeItem(STATE_STORAGE_PATH)

      if ((storedState === returnedState) && (storedState != null)) {
        window.location.replace(withBasePath(`${return_to}?code=${code}`))
      } else {
        console.log('State not equal')
        console.log(storedState, returnedState)
        window.location.replace(withBasePath(return_to))
      }
    }
  }, [])

  useEffect(() => {
    if (authUrl) {
      window.location.replace(authUrl)
    }
  }, [authUrl])

  return null
}
