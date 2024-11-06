import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Button, Container, Link as MuiLink, Stack } from "@mui/material";
import Link from "next/link";


export const metadata: Metadata = {
  title: "RADAR Study",
  description: "Webportal for RADAR-base remote monitoring research studies",
};

export default function StudyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container maxWidth="md">
      <Stack m={4} spacing={4} alignItems="center"> 
        <div>{children}</div>
        <Button href="/" fullWidth variant="contained" LinkComponent={Link}>Home</Button>
      </Stack>
    </Container>
  );
}
