const USER_ENDPOINT = ''
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_HYDRA_PUBLIC_URL + "/oauth2"
const GRANT_TYPE = "authorization_code"
const CLIENT_ID = process.env.SEP_CLIENT_ID ?? "SEP"
const CLIENT_SECRET = process.env.SEP_CLIENT_SECRET  ?? ""
const REDIRECT_URI = process.env.NEXT_PUBLIC_SEP_REDIRECT_URI

export function authRequestLink(state: string): string {
  const scopes = [
    "SOURCETYPE.READ",
    "PROJECT.READ",
    "SUBJECT.READ",
    "SUBJECT.UPDATE",
    "SUBJECT.CREATE",
  ].join("%20")
  const audience = "res_restAuthorizer"
  const authUrl = `${AUTH_BASE_URL}/auth?client_id=${CLIENT_ID}&response_type=code&state=${state}&audience=${audience}&scope=${scopes}&redirect_uri=${REDIRECT_URI}`
  return authUrl
}