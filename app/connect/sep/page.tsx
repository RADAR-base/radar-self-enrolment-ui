"use client"
import { authRequestLink } from "@/app/_lib/radar/rest-source/service";
import { withBasePath } from "@/app/_lib/util/links";
import crypto from "crypto";
import { useSearchParams } from "next/navigation";

const RETURN_TO_STORAGE_PATH = 'connect_sep_return_to'
const STATE_STORAGE_PATH = 'connect_sep_state'

export default function Page() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

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
    const returnedState = searchParams.get('state')
    localStorage.removeItem(STATE_STORAGE_PATH)
    if ((storedState == returnedState) && (returnedState != null)) {
      fetch(withBasePath('/api/connect/sep?' + searchParams.toString())).then(
        (r) => window.location.replace(withBasePath(return_to))
      )
    }
  }
  return
}