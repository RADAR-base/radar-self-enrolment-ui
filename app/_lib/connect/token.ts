"use server"

const AUTH_BASE_URL = process.env.HYDRA_PUBLIC_URL + "/oauth2"
const GRANT_TYPE = "authorization_code"

interface GetAccessTokenParams {
  code: string
  redirectUri: string
  clientId: string
  clientSecret: string
}

export default async function getAccessToken(
  { code, redirectUri, clientId, clientSecret }: GetAccessTokenParams):
  Promise<any> {
  const bodyParams = new URLSearchParams({
    grant_type: GRANT_TYPE,
    code,
    redirect_uri: redirectUri
  })

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    const response = await fetch(`${AUTH_BASE_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${auth}`
      },
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