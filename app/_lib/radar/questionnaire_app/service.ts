const AUTH_BASE_URL = process.env.NEXT_PUBLIC_HYDRA_PUBLIC_URL + "/oauth2"
const GRANT_TYPE = "authorization_code"
const CLIENT_ID = process.env.ARMT_CLIENT_ID ?? "aRMT"
const CLIENT_SECRET = process.env.ARMT_CLIENT_SECRET  ?? ""
const REDIRECT_URI = process.env.NEXT_PUBLIC_ARMT_REDIRECT_URI

export async function getAccessToken(
  code: string,
  redirectUri: string,
): Promise<any> {
  const bodyParams = new URLSearchParams({
    grant_type: GRANT_TYPE,
    code,
    redirect_uri: redirectUri,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  })

  try {
    const response = await fetch(`${AUTH_BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: bodyParams,
    })

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve access token: ${response.statusText}`,
      )
    }

    const data = await response.json()
    return data || null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getAccessTokenFromCode(code: string): Promise<any> {
  const redirectUri = REDIRECT_URI
  if (redirectUri) {
    return getAccessToken(code, redirectUri)
  } else {
    throw "No ARMT redirect URI specified"
  }
}

export function authRequestLink(state: string): string {
  const scopes = [
    "SOURCETYPE.READ",
    "PROJECT.READ",
    "SUBJECT.READ",
    "SUBJECT.UPDATE",
    "MEASUREMENT.CREATE",
    "SOURCEDATA.CREATE",
    "SOURCETYPE.UPDATE",
    "offline_access"
  ].join("%20")
  console.log(REDIRECT_URI)
  const audience = ["res_ManagementPortal", "res_gateway", "res_AppServer"].join("%20")
  const authUrl = `${AUTH_BASE_URL}/auth?client_id=${CLIENT_ID}&response_type=code&state=${state}&audience=${audience}&scope=${scopes}&redirect_uri=${REDIRECT_URI}`
  return authUrl
}

export async function getAuthLink(
  accessToken: any,
  project: any,
): Promise<string> {
  const token = JSON.stringify(accessToken)
  const referrer = window.location.href.split("?")[0]
  const appUrl = `org.phidatalab.radar-armt://enrol?data=${encodeURIComponent(token)}&referrer=${referrer}`
  return appUrl
}
