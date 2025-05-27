import { whoAmI } from "@/app/_lib/auth/ory/kratos"
import { withBasePath } from "@/app/_lib/util/links"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { makeRestSourceUser, getRestSourceAuthLink } from '@/app/_lib/connect/rsa/authorizer'

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
  const redirect_uri  = withBasePath(request.nextUrl.searchParams.get('redirect_uri') ??
                                     `/${studyId}/portal/connect?success=${sourceType}`)
  const authLink = await getRestSourceAuthLink(token.value, rsaUserId, redirect_uri)
  if (authLink) {
    return NextResponse.redirect(new URL(authLink))
  }
  return NextResponse.error()
}