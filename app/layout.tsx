import "./globals.css";
import Head from 'next/head';
import type { Metadata } from "next";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { CssBaseline, ThemeProvider } from "@mui/material";

import defaultTheme from "@/app/_lib/theme/definitions/default";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
      <link
        rel="icon"
        href="kratos-ui/radar/cropped-radar-base-icon-32x32.png"
        type="image/png"
        sizes="32x32"
      />
      </Head>
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" /> */}
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
            <div>{children}</div>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
