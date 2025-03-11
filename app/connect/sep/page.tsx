"use client"
import authRequestLink from "@/app/_lib/connect/authRequest";
import { withBasePath } from "@/app/_lib/util/links";
import crypto from "crypto";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";


const AUDIENCE = 'res_restAuthorizer'
const CLIENT_ID = process.env.SEP_CLIENT_ID ?? 'SEP'
const REDIRECT_URI = process.env.NEXT_PUBLIC_SEP_REDIRECT_URI ?? ''
const SCOPES = [
  "SOURCETYPE.READ",
  "PROJECT.READ",
  "SUBJECT.READ",
  "SUBJECT.UPDATE",
  "SUBJECT.CREATE"
]

const RETURN_TO_STORAGE_PATH = 'connect_sep_return_to'
const STATE_STORAGE_PATH = 'connect_sep_state'

export default function Page() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const returnedState = searchParams.get('state')

  useEffect(() => {
    if (code == null) {
      const state = crypto.randomBytes(20).toString('hex')
      const return_to = searchParams.get('return_to')
      const authLink = authRequestLink({
        audience: AUDIENCE,
        clientId: CLIENT_ID,
        scopes: SCOPES,
        responseType: 'code',
        redirectUri: REDIRECT_URI,
        state: state
      })
      localStorage.setItem(RETURN_TO_STORAGE_PATH, return_to ?? '/')
      localStorage.setItem(STATE_STORAGE_PATH, state)
      window.location.replace(authLink)
    } else {
      let searchParams = new URLSearchParams([['code', code]])
      const return_to = localStorage.getItem(RETURN_TO_STORAGE_PATH) ?? '/'
      localStorage.removeItem(RETURN_TO_STORAGE_PATH)
      const storedState = localStorage.getItem(STATE_STORAGE_PATH)
      localStorage.removeItem(STATE_STORAGE_PATH)
      if ((storedState == returnedState) && (storedState != null)) {
        fetch(withBasePath('/api/connect/sep/token?' + searchParams.toString())).then(
          (r) => window.location.replace(withBasePath(return_to))
        )
      } else {
        console.log('State not equal')
        console.log(storedState, returnedState)
        window.location.replace(withBasePath(return_to))
      }
    }
  }, [])
  return
}