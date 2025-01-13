import "./globals.css";
import type { Metadata } from "next";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { CssBaseline, ThemeProvider } from "@mui/material";

import defaultTheme from "@/app/_lib/theme/definitions/default";
import ParticipantProvider, { Participant } from "./_lib/auth/provider.client";
import { whoAmI } from "./_lib/auth/ory/kratos";

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

  return (
    <html lang="en">
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" /> */}
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={defaultTheme}>
          <CssBaseline />

            <ParticipantProvider participant={participant}>
            <div>{children}</div>
            </ParticipantProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
