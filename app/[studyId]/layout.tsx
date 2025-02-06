import React from 'react';
import { redirect } from 'next/navigation'
import { Box, CssBaseline, Theme, ThemeProvider } from "@mui/material";

import NavBar from "@/app/_ui/components/navbar/navbar";
import {Footer, FooterItem } from "@/app/_ui/components/footer";

import { CookieBanner } from '@/app/_ui/cookies/banner';
import { cookies } from 'next/headers';
import { GoogleAnalytics } from '@next/third-parties/google';

import { whoAmI } from '@/app/_lib/auth/ory/kratos';
import { isAbsolutePath, withBasePath } from "@/app/_lib/util/links";

import { getStudyTheme } from "@/app/_lib/theme/themeprovider";
import ParticipantProvider, { Participant } from '../_lib/auth/provider.client';
import ProtocolProvider from '@/app/_lib/study/protocol/provider.client';
import ProtocolRepository, { StudyProtocolRepository } from "@/app/_lib/study/protocol/repository";
import { StudyProtocol } from '@/app/_lib/study/protocol';


const getStudyTitle = (studyId: string) => {
  return studyId ? studyId + " Study" : 'Unknown RADAR Study'
}

const getStudyDescription = (studyId: string) => {
  const description = studyId ? "Study description for " + studyId : "Unknown study"
  return description
}

function makeRelativePaths(links: FooterItem[], studyId: string): FooterItem[] {
  return links.map(
    (link) => {
      if (link.href != undefined) {
        if  (!isAbsolutePath(link.href)) {
        link.href = '/' + studyId + '/' + link.href
        }
      }
      return link
    }
  )
}

export async function generateMetadata({params}: {params: {studyId: string}}) {
  var registery: StudyProtocolRepository = new ProtocolRepository()
  var protocol: StudyProtocol;
  protocol = await registery.getStudyProtocol(params.studyId)
  if (protocol == undefined){ return }
  return {
    title: getStudyTitle(protocol.studyId),
    description: getStudyDescription(protocol.studyId),
    icons: [
      {
        href: withBasePath(protocol.studyUiConfig.faviconSrc),
        url: withBasePath(protocol.studyUiConfig.faviconSrc)
      }
    ]
  }
}

export default async function StudyLayout({children, params}: Readonly<{children: React.ReactNode, params: {studyId: string}}>) {
  const theme = getStudyTheme(params.studyId);
  const cookieStore = cookies()
  const cookieChoice = cookieStore.get("cookieChoice")
  var registery: StudyProtocolRepository = new ProtocolRepository()
  var protocol: StudyProtocol
  try {
    protocol = await registery.getStudyProtocol(params.studyId)
  } catch {
    redirect('/')
  }


  const gaEnabled = (protocol.studyUiConfig.analytics?.gaId != undefined) && (cookieChoice != undefined) && (cookieChoice.value == "all")

  return (
    <React.Fragment>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProtocolProvider protocol={protocol}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 320
          }}>

          <NavBar
            title={protocol.name}
            logo_src={protocol.studyUiConfig.navbar.logoSrc}
            links={protocol.studyUiConfig.navbar.links}
          />
            {children}
          <Footer 
            columns={protocol.studyUiConfig.footer.columns.map(
              (col) => {
                col.items = makeRelativePaths(col.items, params.studyId)
                return col})}
            copyrightText={protocol.studyUiConfig.footer.copyrightText}
          />
        </Box>
        {(cookieChoice == undefined) ? <CookieBanner /> : null}
        {gaEnabled && <GoogleAnalytics gaId={protocol.studyUiConfig.analytics.gaId}/>}
      </ProtocolProvider>
    </ThemeProvider>
    </React.Fragment>
  )
}