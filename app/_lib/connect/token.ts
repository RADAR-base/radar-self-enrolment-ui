"use server"

const AUTH_BASE_URL = process.env.HYDRA_PUBLIC_URL + "/oauth2"
const ARMT_CLIENT_ID = process.env.ARMT_CLIENT_ID ?? 'aRMT'
const SEP_CLIENT_ID = process.env.SEP_CLIENT_ID ?? 'SEP'
const GRANT_TYPE = "authorization_code"

interface GetAccessTokenParams {
  code: string
  redirectUri: string
  clientId: string
  clientSecret: string
}

export default async function getAccessToken(
  { code, redirectUri, clientId, clientSecret }: GetAccessTokenParams
): Promise<any> {
  const bodyParams = new URLSearchParams({
    grant_type: GRANT_TYPE,
    code,
    redirect_uri: redirectUri,
    client_id: clientId
  })

  if (clientId !== ARMT_CLIENT_ID) {
    bodyParams.append("client_secret", clientSecret)
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  }

  if (clientId !== ARMT_CLIENT_ID) {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    headers["Authorization"] = `Basic ${auth}`
  }

  try {
    const response = await fetch(`${AUTH_BASE_URL}/token`, {
      method: "POST",
      headers,
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
