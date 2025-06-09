import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { cookies, headers } from 'next/headers';
import { redirect, usePathname } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import React from 'react';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { StudyProtocol } from '@/app/_lib/study/protocol';
import { OrySessionResponse } from '@/app/_lib/auth/ory/types';
import { GetOauthToken } from '@/app/_ui/auth/oauthToken';


export async function generateMetadata({params}: {params: {studyId: string}}) {
  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  if (protocol == undefined){ return }
  return {
    title: protocol.name + ' Tasks',
  }
}

function token_matches_session(token: string, session: any, studyId: string): boolean {
  const env = process.env.NODE_ENV
  if (env == 'development') {
    return true
  }
  const jwtToken = jwtDecode(token)
  const tokenUserId = jwtToken.sub
  const projects: {userId: string, id: string}[] = session['identity']['traits']['projects']
  const sessionUserId = projects.find((project) => project.id == studyId)?.userId
  return ((sessionUserId != undefined) && (tokenUserId != undefined) && (sessionUserId == tokenUserId))
}

export default async function StudyLayout({children, params}: Readonly<{children: React.ReactNode, params: {studyId: string}}>) {
  const cookieStore = cookies()
  const kratos_cookie = cookieStore.get('ory_kratos_session')
  if (kratos_cookie == undefined) {redirect(`/${params.studyId}/login`)}
  const userSessionResponse = await whoAmI()
  if (!userSessionResponse.ok) { redirect(`/${params.studyId}/login`)}
  const userSession = (await userSessionResponse.json()) as OrySessionResponse
  const verifiableAddress = userSession.identity.verifiable_addresses.find((a) => a.value == userSession.identity.traits.email)
  if (verifiableAddress != undefined) {
      if (!verifiableAddress.verified) {
        redirect(`/${params.studyId}/verification`)
      }
  }
  const accessToken = (cookieStore.get('sep_access_token'))
  const hasAccess = ((accessToken != undefined) && (token_matches_session(accessToken.value, userSession, params.studyId)))
  return <React.Fragment>{hasAccess ? <React.Fragment>{children}</React.Fragment> : <GetOauthToken />}</React.Fragment>
}