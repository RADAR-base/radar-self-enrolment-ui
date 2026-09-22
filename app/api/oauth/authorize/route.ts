import { cookies } from "next/headers"
import { setCookies } from "@/app/_lib/auth/cookies"
import { NextRequest, NextResponse } from "next/server"

const DELEGATE_API_URL = process.env.DELEGATE_API_URL

export async function POST(request: NextRequest) {
  const client = request.nextUrl.searchParams.get('client')
  if (!client) {
    return NextResponse.json({ error: 'client param required' }, { status: 400 })
  }

  const cookieString = (await cookies()).getAll().map((c) => `${c.name}=${c.value}`).join('; ')

  const url = new URL(`${DELEGATE_API_URL}/oauth/authorize`)
  url.searchParams.set('client', client)
  const scopes = request.nextUrl.searchParams.get('scopes')
  if (scopes) url.searchParams.set('scopes', scopes)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      Cookie: cookieString,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Authorization failed' }, { status: res.status })
  }

  await setCookies(res)
  const token = await res.json()
  return NextResponse.json(token)
}
