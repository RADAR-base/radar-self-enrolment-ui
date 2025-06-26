import { notFound } from 'next/navigation';
import React from 'react';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';

export default async function PageLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{ studyId: string }>
}>
) {
  const { studyId } = await params
  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(studyId)
  if (protocol == undefined) { notFound() }
  if (!protocol.protocols.some(p => (p.id == "connect"))) {
    notFound()
  }
  return <React.Fragment>{children}</React.Fragment>
}