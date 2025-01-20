import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import React from 'react';

function token_matches_session(token: string, session: any, studyId: string): boolean {
  const jwtToken = jwtDecode(token)
  const tokenUserId = jwtToken.sub
  const projects: {userId: string, id: string}[] = session['identity']['traits']['projects']
  const sessionUserId = projects.find((project) => project.id == studyId)?.userId
  return ((sessionUserId != undefined) && (tokenUserId != undefined) && (sessionUserId == tokenUserId))
}

export default async function StudyLayout({children, params}: Readonly<{children: React.ReactNode, params: {studyId: string}}>) {
  const cookieStore = cookies()
  const kratos_cookie = cookieStore.get('ory_kratos_session')
  if (kratos_cookie == undefined) {redirect('./')}

  const userSessionResponse = await whoAmI()
  if (!userSessionResponse.ok) {
    redirect('./')
    return <div></div>
  }
  const userSession = await userSessionResponse.json()

  const sep_access_token = cookieStore.get('sep_access_token')
  if (sep_access_token == undefined) {
    redirect('/connect/rsa')
  }

  if (!token_matches_session(sep_access_token.value, userSession, params.studyId)) {
    redirect('/connect/rsa')
  }

  return <React.Fragment>{children}</React.Fragment>
}