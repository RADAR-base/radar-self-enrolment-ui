import { cookies } from "next/headers"
import { NextResponse } from "next/server"

/**
 * Reports whether the caller holds a SEP access token, without exposing the token
 * itself. This lets `sep_access_token` be set httpOnly: the browser can no longer
 * read the cookie directly, so it asks the server instead.
 */
export async function GET() {
  const cookieStore = await cookies()
  const connected = cookieStore.get('sep_access_token') != undefined
  return NextResponse.json({ connected }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
