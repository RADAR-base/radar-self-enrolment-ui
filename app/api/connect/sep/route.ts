import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_HYDRA_PUBLIC_URL + "/oauth2"
const GRANT_TYPE = "authorization_code"
const CLIENT_ID = process.env.SEP_CLIENT_ID ?? "SEP"
const CLIENT_SECRET = process.env.SEP_CLIENT_SECRET  ?? ""
const REDIRECT_URI = process.env.NEXT_PUBLIC_SEP_REDIRECT_URI ?? ""

async function getAccessToken(
  code: string,
): Promise<any> {
  const bodyParams = new URLSearchParams({
    grant_type: GRANT_TYPE,
    code: code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  })
  console.log(bodyParams)
  try {
    const response = await fetch(`${AUTH_BASE_URL}/token`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
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

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const code  = request.nextUrl.searchParams.get('code')
  if (code == null) {
    return NextResponse.json({error: 'No code provided'}, {status: 400})
  }
  const token = await getAccessToken(code)
  cookieStore.set('sep_access_token', token['access_token'])
  return NextResponse.json({'token': token})
}