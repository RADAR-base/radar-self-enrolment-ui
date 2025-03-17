'use client'
import authRequestLink from "@/app/_lib/connect/authRequest";
import { withBasePath } from "@/app/_lib/util/links";
import crypto from "crypto";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const CLIENT_ID = process.env.ARMT_CLIENT_ID ?? 'aRMT'
const REDIRECT_URI = process.env.NEXT_PUBLIC_ARMT_REDIRECT_URI ?? ''
const SCOPES = [
  'SOURCETYPE.READ',
  'PROJECT.READ',
  'SUBJECT.READ',
  'SUBJECT.UPDATE',
  'MEASUREMENT.CREATE',
  'SOURCEDATA.CREATE',
  'SOURCETYPE.UPDATE',
  'offline_access'
]
const AUDIENCE = ['res_ManagementPortal', 'res_gateway', 'res_AppServer'].join('%20')

const RETURN_TO_STORAGE_PATH = 'connect_armt_return_to'
const STATE_STORAGE_PATH = 'connect_armt_state'

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
      const return_to = localStorage.getItem(RETURN_TO_STORAGE_PATH) ?? '/'
      const storedState = localStorage.getItem(STATE_STORAGE_PATH)
      localStorage.removeItem(RETURN_TO_STORAGE_PATH)
      localStorage.removeItem(STATE_STORAGE_PATH)
      if ((storedState == returnedState) && (storedState != null)) {
        window.location.replace(withBasePath(`${return_to}?code=${code}`))
      } else {
        console.log('State not equal')
        console.log(storedState, returnedState)
        window.location.replace(withBasePath(return_to))
      }
    }
  }, [])
  return
}