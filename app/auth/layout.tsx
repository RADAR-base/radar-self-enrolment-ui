import type { Metadata } from "next";
import "@/app/globals.css";
import { Box } from "@mui/material";
import { cookies } from "next/headers";
import { GetCSRF } from "@/app/auth/_components/getCSRF";

export const metadata: Metadata = {
  title: "RADAR Study",
  description: "Webportal for RADAR-base remote monitoring research studies",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieJar = await cookies()
  const csrfToken = cookieJar.getAll().find((c) => c.name.startsWith('csrf_token_'))

  return (
    <main>
       <Box m={'auto'}
            p={2}
            display="flex"
            justifyContent="center"
            minWidth={'100vW'}
            minHeight={'100vH'}
            alignItems='center'>
        {csrfToken == undefined ? <GetCSRF /> : null}
        {children}
      </Box>
    </main>
  )
}
