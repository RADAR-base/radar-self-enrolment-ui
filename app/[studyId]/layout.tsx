import React from 'react';
import { notFound, redirect } from 'next/navigation'
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";

import NavBar from "@/app/_ui/components/navbar/navbar";
import {Footer, FooterItem } from "@/app/_ui/components/footer";

import { CookieBanner } from '@/app/_ui/cookies/banner';
import { cookies } from 'next/headers';
import { GoogleAnalytics } from '@next/third-parties/google';

import { isAbsolutePath, withBasePath } from "@/app/_lib/util/links";

import ProtocolProvider from '@/app/_lib/study/protocol/provider.client';
import ProtocolRepository, { StudyProtocolRepository } from "@/app/_lib/study/protocol/repository";
import { StudyProtocol } from '@/app/_lib/study/protocol';
import ThemeProviderFromObject from '../_ui/components/base/themeProviderFromObject';

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
  const registery: StudyProtocolRepository = new ProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  if (protocol == undefined) { return }
  return {
    title: protocol.name + ' Study',
    icons: [
      {
        href: withBasePath(protocol.studyUiConfig.faviconSrc),
        url: withBasePath(protocol.studyUiConfig.faviconSrc)
      }
    ]
  }
}

export default async function StudyLayout({children, params}: Readonly<{children: React.ReactNode, params: {studyId: string}}>) {
  const cookieStore = cookies()
  const cookieChoice = cookieStore.get("cookieChoice")
  const registery: StudyProtocolRepository = new ProtocolRepository()
  const protocol = await registery.getStudyProtocol(params.studyId)
  if (protocol == undefined) {
    notFound()
  }

  const themeObject = protocol.studyUiConfig.materialTheme
  const gaEnabled = (protocol.studyUiConfig.analytics?.gaId != undefined) && (cookieChoice != undefined) && (cookieChoice.value == "all")

  return (
    <React.Fragment>
       {/* 
        TODO - ThemeProviderFromObject does not apply component theming.
        Meanwhile, ThemeProvider can not take an actual Theme in a server-side component
        because it contains functions. The themeObject does not contain all required
        options. By using them in tandem, the entire theme is applied, but there should
        be a better solution.
        */}
      <ThemeProvider theme={themeObject}>      
      <ThemeProviderFromObject themeObject={themeObject}>
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
    </ThemeProviderFromObject>
    </ThemeProvider>

    </React.Fragment>
  )
}