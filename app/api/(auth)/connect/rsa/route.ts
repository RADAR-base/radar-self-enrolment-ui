import { whoAmI } from "@/app/_lib/auth/ory/kratos"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const DELEGATE_API_URL = process.env.DELEGATE_API_URL

export async function GET(request: NextRequest) {
  const sourceType = request.nextUrl.searchParams.get('device')
  if (!sourceType) {
    return new NextResponse('A device search parameter must be specified', { status: 400 })
  }
  if (!DELEGATE_API_URL) {
    return new NextResponse('Backend not configured', { status: 500 })
  }
  const cookieStore = await cookies()
  const token = cookieStore.get('sep_access_token')
  if (!token) {
    return new NextResponse('Invalid access token', { status: 401 })
  }
  const userSession = await (await whoAmI()).json()
  const study = userSession['identity']['traits']['projects'][0]
  const userId = study['userId']
  const studyId = study['id']

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token.value}`,
  }
  const basePath = `${DELEGATE_API_URL}/sources/projects/${encodeURIComponent(studyId)}/participants/${encodeURIComponent(userId)}/devices/${encodeURIComponent(sourceType)}`

  // Create RSA user for this device
  const createRes = await fetch(basePath, { method: 'POST', headers })
  if (!createRes.ok) {
    const body = await createRes.text()
    console.error('Failed to create RSA user:', body)
    return new NextResponse('Could not create or get Rest Source Auth user', { status: 500 })
  }
  const device = await createRes.json()

  // Get authorization URL
  const authRes = await fetch(`${basePath}/authorize`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ userId: device.id, sourceType: device.sourceType }),
  })
  if (!authRes.ok) {
    console.error('Failed to get auth link:', await authRes.text())
    return new NextResponse('Could not get authorization link', { status: 500 })
  }
  const { authUrl } = await authRes.json()
  if (!authUrl) {
    return new NextResponse('No authorization URL returned', { status: 500 })
  }

  return NextResponse.redirect(new URL(authUrl))
}
