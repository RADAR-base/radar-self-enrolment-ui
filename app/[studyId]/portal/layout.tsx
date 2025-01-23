import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import React from 'react';
import { authRequestLink } from '@/app/_lib/radar/rest-source/service';

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
  const state = crypto.randomUUID()

  if (kratos_cookie == undefined) {redirect('./')}

  const userSessionResponse = await whoAmI()
  if (!userSessionResponse.ok) {
    redirect('./')
    return <div></div>
  }
  const userSession = await userSessionResponse.json()

  const sep_access_token = cookieStore.get('sep_access_token')
  if (sep_access_token == undefined) {
    redirect(authRequestLink(state))
  }

  if (!token_matches_session(sep_access_token.value, userSession, params.studyId)) {
    redirect(authRequestLink(state))
  }

  return <React.Fragment>{children}</React.Fragment>
}