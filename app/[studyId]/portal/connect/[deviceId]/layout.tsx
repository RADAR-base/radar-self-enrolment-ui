import { notFound } from 'next/navigation';
import React from 'react';
import StudyProtocolRepository from '@/app/_lib/study/protocol/repository';
import { connect } from 'http2';

export default async function PageLayout({children, params}: Readonly<{children: React.ReactNode, params: {studyId: string, deviceId: string}}>) {
  const registery: StudyProtocolRepository = new StudyProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  if (protocol == undefined) { notFound() }
  const connectTask = protocol.protocols.find(p => (p.id == "connect"))
  if (connectTask == undefined) {
    notFound()
  }
  if  (!(connectTask.metadata.options.devices as {id: string, title: string, logo_src: string, description: string}[]).some(d => d.id == params.deviceId)) {
    notFound()
  }
  return <React.Fragment>{children}</React.Fragment>
}