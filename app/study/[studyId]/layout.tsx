import { redirect } from 'next/navigation'
import { getStudyTheme } from "@/app/_lib/theme/themeprovider";
import ProtocolRepository, { StudyProtocolRepository } from "@/app/_lib/study/protocol/repository";
import { StudyProtocol } from '@/app/_lib/study/protocol';
import { isAbsolutePath } from "@/app/_lib/util/links";

import { Box, CssBaseline, Theme, ThemeProvider } from "@mui/material";
import NavBar from "@/app/_ui/components/navbar/navbar";
import {Footer, FooterLink } from "@/app/_ui/components/footer";
import ProtocolProvider from '@/app/_lib/study/protocol/provider.client';



const getStudyTitle = (studyId: string) => {
  return studyId ? studyId + " Study" : 'Unknown RADAR Study'
}

const getStudyDescription = (studyId: string) => {
  const description = studyId ? "Study description for " + studyId : "Unknown study"
  return description
}

function makeRelativePaths(links: FooterLink[], studyId: string): FooterLink[] {
  return links.map(
    (link) => {
      if (link.href != undefined) {
        if  (!isAbsolutePath(link.href)) {
        link.href = '/study/' + studyId + '/' + link.href
        }
      }
      return link
    }
  )
}

export async function generateMetadata({params}: {params: {studyId: string}}) {
  return {
    title: getStudyTitle(params.studyId),
    description: getStudyDescription(params.studyId)
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
  )
}