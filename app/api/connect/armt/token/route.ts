import getAccessToken from "@/app/_lib/connect/token"
import { NextRequest, NextResponse } from "next/server"

const CLIENT_ID = process.env.ARMT_CLIENT_ID ?? "aRMT"
const CLIENT_SECRET = process.env.ARMT_CLIENT_SECRET  ?? ""
const REDIRECT_URI = process.env.NEXT_PUBLIC_ARMT_REDIRECT_URI ?? ""

export async function GET(request: NextRequest) {
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
  return NextResponse.json(token)
}