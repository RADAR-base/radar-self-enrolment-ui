import { redirect } from 'next/navigation'
import { getStudyTheme } from "@/app/_lib/theme/themeprovider";
import ProtocolRepository, { StudyProtocolRepository } from "@/app/_lib/study/protocol/repository";
import { StudyProtocol } from '@/app/_lib/study/protocol';
import { isAbsolutePath, withBasePath } from "@/app/_lib/util/links";

import { Box, CssBaseline, Theme, ThemeProvider } from "@mui/material";
import NavBar from "@/app/_ui/components/navbar/navbar";
import {Footer, FooterItem } from "@/app/_ui/components/footer";
import ProtocolProvider from '@/app/_lib/study/protocol/provider.client';
import React from 'react';

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
        href: withBasePath(protocol.studyUiConfig.studyIconSrc),
        url: withBasePath(protocol.studyUiConfig.studyIconSrc)
      }
    ]
  }
}

export default async function StudyLayout({children, params}: Readonly<{children: React.ReactNode, params: {studyId: string}}>) {
  const theme = getStudyTheme(params.studyId);

  var registery: StudyProtocolRepository = new ProtocolRepository()
  var protocol: StudyProtocol;
  try {
    protocol = await registery.getStudyProtocol(params.studyId)
  } catch {
    redirect('/')
  }
  return (
    <React.Fragment>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 320
        }}>
        <NavBar
          title={protocol.name}
          logo_src={protocol.studyUiConfig.studyIconSrc}
          links={protocol.studyUiConfig.navbarLinks}
        />
        <ProtocolProvider protocol={protocol}>
          {children}
        </ProtocolProvider>
        <Footer 
          columns={protocol.studyUiConfig.footer.columns.map(
            (col) => {
              col.items = makeRelativePaths(col.items, params.studyId)
              return col})}
          copyrightText={protocol.studyUiConfig.footer.copyrightText}
        />
      </Box>
    </ThemeProvider>
    </React.Fragment>
  )
}