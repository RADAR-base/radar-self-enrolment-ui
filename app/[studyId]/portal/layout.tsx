import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function StudyLayout({children, params}: Readonly<{children: React.ReactNode, params: {studyId: string}}>) {
  const userSessionResponse = await whoAmI()
  if (!userSessionResponse.ok) {
    redirect('./')
    return <div></div>
  }
  return <React.Fragment>{children}</React.Fragment>
}