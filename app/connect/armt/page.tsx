"use client"
import { authRequestLink } from "@/app/_lib/radar/questionnaire_app/service";
import { withBasePath } from "@/app/_lib/util/links";
import crypto from "crypto";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const code = useSearchParams().get('code')
  const state = crypto.randomBytes(20).toString('hex')  
  let redirectUri = useSearchParams().get('redirect_uri')
  if(redirectUri) {
    localStorage.setItem('redirectUri', redirectUri)
  }

  if (code == null) {
    window.location.replace(authRequestLink(state))
  } else {
    let searchParams = new URLSearchParams([['code', code]])
    redirectUri = localStorage.getItem('redirectUri')
    fetch(withBasePath('/api/connect/sep?' + searchParams.toString())).then(
      (r) => window.location.replace(withBasePath(`${redirectUri}?code=${code}`))
    )
  }
  return
}