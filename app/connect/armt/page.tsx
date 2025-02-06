"use client"
import { authRequestLink } from "@/app/_lib/radar/questionnaire_app/service";
import { withBasePath } from "@/app/_lib/util/links";
import crypto from "crypto";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
      localStorage.setItem(RETURN_TO_STORAGE_PATH, return_to ?? '/')
      localStorage.setItem(STATE_STORAGE_PATH, state)
      window.location.replace(authRequestLink(state))
    } else {
      let searchParams = new URLSearchParams([['code', code]])
      const return_to = localStorage.getItem(RETURN_TO_STORAGE_PATH) ?? '/'
      localStorage.removeItem(RETURN_TO_STORAGE_PATH)
      const storedState = localStorage.getItem(STATE_STORAGE_PATH)
      localStorage.removeItem(STATE_STORAGE_PATH)
      if ((storedState == returnedState) && (storedState != null)) {
        fetch(withBasePath('/api/connect/sep?' + searchParams.toString())).then(
          (r) => window.location.replace(withBasePath(`${return_to}?code=${code}`))
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