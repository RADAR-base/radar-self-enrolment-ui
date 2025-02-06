import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import React from 'react';
import { authRequestLink } from '@/app/_lib/radar/rest-source/service';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { StudyProtocol } from '@/app/_lib/study/protocol';


export async function generateMetadata({params}: {params: {studyId: string}}) {
  var registery: StudyProtocolRepository = new StudyProtocolRepository()
  var protocol: StudyProtocol;
  protocol = await registery.getStudyProtocol(params.studyId)
  if (protocol == undefined){ return }
  return {
    title: protocol.name + ' Portal',
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
  const return_to = '/' + params.studyId

  if (kratos_cookie == undefined) {redirect('./')}

  const userSessionResponse = await whoAmI()
  if (!userSessionResponse.ok) {
    redirect('./')
  }
  const userSession = await userSessionResponse.json()

  const sep_access_token = cookieStore.get('sep_access_token')
  if (sep_access_token == undefined) {
    redirect('/connect/sep?return_to=' + return_to)
  }

  if (!token_matches_session(sep_access_token.value, userSession, params.studyId)) {
    redirect('/connect/sep?return_to=' + return_to)
  }

  return <React.Fragment>{children}</React.Fragment>
}