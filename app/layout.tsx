import "./globals.css";
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      {/* <meta name="viewport" content="initial-scale=1, width=device-width" /> */}
      <body>
      {/* <StyledEngineProvider injectFirst> */}
        <AppRouterCacheProvider>
          <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
            <div>{children}</div>
          </ThemeProvider>
        </AppRouterCacheProvider>
      {/* </StyledEngineProvider> */}
      </body>
    </html>
  );
}
