import { notFound } from 'next/navigation';
import React from 'react';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { connect } from 'http2';

export default async function PageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ studyId: string; deviceId: string }>
}>) {

  const { studyId, deviceId } = await params
  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(studyId)
  if (protocol == undefined) { notFound() }
  const connectTask = protocol.protocols.find(p => (p.id == "connect"))
  if (connectTask == undefined) {
    notFound()
  }
  if  (!(connectTask.metadata.options.devices as {id: string, title: string, logo_src: string, description: string}[]).some(d => d.id == deviceId)) {
    notFound()
  }
  return <>{children}</>
}