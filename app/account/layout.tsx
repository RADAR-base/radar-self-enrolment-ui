import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Box, Button, Container, Link as MuiLink, Stack } from "@mui/material";
import Link from "next/link";


export const metadata: Metadata = {
  title: "RADAR Study",
  description: "Webportal for RADAR-base remote monitoring research studies",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
       <Box m={'auto'}
            p={2} 
            display="flex"
            justifyContent="center"
            minWidth={'100vW'}
            minHeight={'100vH'}
            alignItems='center'>
        {children}
      </Box>
    </main>
  )
}
