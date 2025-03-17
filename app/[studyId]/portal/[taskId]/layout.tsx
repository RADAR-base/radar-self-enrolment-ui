import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { StudyProtocol } from '@/app/_lib/study/protocol';

export default async function PageLayout({children, params}: Readonly<{children: React.ReactNode, params: {studyId: string, taskId: string}}>) {
  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  if (protocol == undefined) { notFound() }
  if (!protocol.protocols.some(p => (p.id == params.taskId))) {
    notFound()
  }
  return <React.Fragment>{children}</React.Fragment>
}