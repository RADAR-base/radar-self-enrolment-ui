import { whoAmI } from "@/app/_lib/auth/ory/kratos"
import { withBasePath } from "@/app/_lib/util/links"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const RSA_BACKEND_URL = process.env.RSA_BACKEND_URL
const RSA_FRONTEND_URL = process.env.RSA_FRONTEND_URL


async function makeRestSourceUser(
  accessToken: string,
  userId: string,
  projectId: string,
  sourceType: string
): Promise<string | null> {
  try {
    if (RSA_BACKEND_URL == undefined) {return null}
    const response = await fetch(`${RSA_BACKEND_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId: userId,
        projectId: projectId,
        sourceType: sourceType,
        startDate: new Date().toISOString(),
      }),
    })
    if (!response.ok) {
      const data = await response.json()
      if (response.status === 409 && data.user) {
        console.warn("User already exists:", data.message)
        return data.user.id
      } else {
        console.log(`url: ${RSA_BACKEND_URL}/users`)
        console.log(`user: ${userId}`)
        console.log(`study: ${projectId}`)
        console.log(`source: ${sourceType}`)

        console.log(data)
        throw new Error(
          `Failed to create user: ${data.message || response.statusText}`,
        )
      }
    }
    const userDto = await response.json()
    return userDto.id
  } catch (error) {
    console.error(error)
    return null
  }
}

async function getRestSourceAuthLink(
  accessToken: string,
  userId: string,
  redirect_uri: string
): Promise<string | null> {
  console.error(`url: ${RSA_BACKEND_URL}/registrations`)
  try {
    const response = await fetch(`${RSA_BACKEND_URL}/registrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId: userId,
        persistent: false,
      }),
    })

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve registration token: ${response.statusText}`,
      )
    }

    const data = await response.json()
    if (!data.token || !data.secret) {
      throw new Error("Failed to retrieve auth link")
    }

    return `${RSA_FRONTEND_URL}/users:auth?token=${data.token}&secret=${data.secret}&redirect=true&return_to=${encodeURIComponent(redirect_uri)}`
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const sourceType  = request.nextUrl.searchParams.get('device')
  if (sourceType == undefined) {
    return new NextResponse('A device search parameter must be specified', {status: 400})
  }

  const cookieStore = cookies()
  const token = cookieStore.get('sep_access_token')
  if (token == undefined) {
    return new NextResponse('Invalid access token', {status: 401})
  }
  const userSession = await (await whoAmI()).json()
  const study = userSession['identity']['traits']['projects'][0]
  const userId = study['userId']
  const studyId = study['id']
  const rsaUserId = await makeRestSourceUser(token.value, userId, studyId, sourceType)
  if (rsaUserId == null) {
    return new NextResponse('Could not create or get Rest Source Auth user', {status: 500})
  }

  const redirect_uri  = withBasePath(request.nextUrl.searchParams.get('redirect_uri') ?? `/${studyId}/portal/connect/success=${sourceType}`)
  const authLink = await getRestSourceAuthLink(token.value, rsaUserId, redirect_uri)
  return new NextResponse(authLink)
}