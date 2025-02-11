import "./globals.css";
import type { Metadata } from "next";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { CssBaseline, ThemeProvider } from "@mui/material";

import defaultTheme from "@/app/_lib/theme/default";
import ParticipantProvider, { Participant } from "./_lib/auth/provider.client";
import { whoAmI } from "./_lib/auth/ory/kratos";
import { cookies } from "next/headers";
import { GetCSRF } from "./_ui/auth/getCSRF";
import { Montserrat, Roboto } from "next/font/google";

const msrt_font = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat'
})

const roboto_font = Roboto({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-roboto'
})


export const metadata: Metadata = {
  title: "RADAR WebPortal",
  description: "Webportal for RADAR-base remote monitoring research studies",
  icons: [
    {
      href: '/kratos-ui/radar/icon.png',
      url: '/kratos-ui/radar/icon.png'
    }
  ]
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  var participant: Participant | undefined = undefined
  const userSessionResponse = await whoAmI()
  if (userSessionResponse.ok) {
    const data = await userSessionResponse.json()
    participant = {
        userId: data['identity']['id'],
        loggedIn: true
      }
    } else {
      participant = {
          userId: undefined,
          loggedIn: false
        }
    }
  const cookieJar = cookies()
  const csrfToken = cookieJar.getAll().find((c) => c.name.startsWith('csrf_token_'))
  return (
    <html lang="en">
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" /> */}
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <body className={[msrt_font.variable, roboto_font.variable].join(' ')}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={defaultTheme}>
          <CssBaseline />

            <ParticipantProvider participant={participant}>
            {csrfToken == undefined ? <GetCSRF></GetCSRF> : null}
            <div>{children}</div>
            </ParticipantProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
