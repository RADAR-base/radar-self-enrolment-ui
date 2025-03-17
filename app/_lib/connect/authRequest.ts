const AUTH_BASE_URL = process.env.NEXT_PUBLIC_HYDRA_PUBLIC_URL + "/oauth2"

export interface AuthRequestLinkParameters {
  scopes?: string[]
  clientId: string
  responseType: string
  audience: string
  redirectUri: string
  state: string
}

export default function authRequestLink(params: AuthRequestLinkParameters): string {
  const scopes = (
    params.scopes ?? 
    [
      "SOURCETYPE.READ",
      "PROJECT.READ",
      "SUBJECT.READ",
      "SUBJECT.UPDATE",
      "SUBJECT.CREATE"
    ]
  ).join("%20")

  const urlParams = [
    ['client_id', params.clientId],
    ['response_type', params.responseType],
    ['audience', params.audience],
    ['scope', scopes],
    ['redirect_uri', params.redirectUri],
    ['state', params.state]
  ]
  const authUrl = `${AUTH_BASE_URL}/auth?` + urlParams.map((c) => c.join('=')).join('&')
  return authUrl
}