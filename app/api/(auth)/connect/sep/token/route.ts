import getAccessToken from "@/app/_lib/connect/token"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const CLIENT_ID = process.env.SEP_CLIENT_ID ?? "SEP"
const CLIENT_SECRET = process.env.SEP_CLIENT_SECRET  ?? ""
const REDIRECT_URI = process.env.NEXT_PUBLIC_SEP_REDIRECT_URI ?? ""

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const code  = request.nextUrl.searchParams.get('code')
  if (code == null) {
    return NextResponse.json({error: 'No code provided'}, {status: 400})
  }
  const token = await getAccessToken({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    code: code,
    redirectUri: REDIRECT_URI
  })
  if (token == null) {
    return NextResponse.json({error: 'Unknown error retrieving token'}, {status: 500})
  }
  cookieStore.set('sep_access_token', token['access_token'])
  return NextResponse.json(token)
}