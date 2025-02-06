import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url"

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_HYDRA_PUBLIC_URL + "/oauth2"
const CLIENT_ID = process.env.SEP_CLIENT_ID ?? "SEP"
const REDIRECT_URI = process.env.NEXT_PUBLIC_SEP_REDIRECT_URI
const AUDIENCE = "res_restAuthorizer"

export function authRequestLink(state?: string): string {
  const scopes = [
    "SOURCETYPE.READ",
    "PROJECT.READ",
    "SUBJECT.READ",
    "SUBJECT.UPDATE",
    "SUBJECT.CREATE",
  ].join("%20")
  let params = [
    ['client_id', CLIENT_ID],
    ['response_type', 'code'],
    ['audience', AUDIENCE],
    ['scope', scopes],
    ['redirect_uri', REDIRECT_URI ?? '']
  ]
  if (state) {
    params.push(['state', state])
  }
  const authUrl = `${AUTH_BASE_URL}/auth?` + params.map((c) => c.join('=')).join('&')
  return authUrl
}