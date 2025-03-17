"use server"
import React from "react";

import { Button, Box, Typography, Container, TextField } from "@mui/material";
import Grid from '@mui/material/Grid2';

import { RadarCard } from "@/app/_ui/components/base/card";
import NavBar from "@/app/_ui/components/navbar/navbar";
import { Footer } from "@/app/_ui/components/footer";
import { LogoutButton } from "@/app/_ui/auth/logout";
import Link from "next/link";
import { whoAmI } from "./_lib/auth/ory/kratos";
import '@fontsource/roboto/400.css';

export default async function Home() {
  const session = await (await whoAmI()).json()
  const studies = ['paprka', 'RADAR-mCRAVING-KCL-s1']

  return (
    <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
    <NavBar 
      title="RADAR Portal"
      logo_src='/radar/rb-logo-320.avif'
      links={[
        {'text': 'Home', 'href': '/'},
        {'text': 'About', 'href': '/about'}
      ]} 
    />
    <main>
      <Box sx={{flexGrow: 1, margin: {xs: 0, sm: 2}}} 
            display="flex"
            justifyContent="center"
            alignItems="center">
        <Container maxWidth="lg" disableGutters>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, sm: 6}}>
            <RadarCard>
              <Typography variant="h2" margin={2}>Account routes</Typography>
              <Grid container spacing={2} margin={2}>
                <Grid size={{xs: 12, md: 6}}>
                  <Button href="/auth/signup" fullWidth variant="contained" LinkComponent={Link}>Sign Up</Button>
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <Button href="/auth/login" fullWidth variant="contained" LinkComponent={Link}>Login</Button>

                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <LogoutButton />
                </Grid>
                <Grid size={{xs: 12, md: 12}}>
                  {JSON.stringify(session)}
                </Grid>
              </Grid>
            </RadarCard>
          </Grid>
          <Grid size={{xs: 12, sm: 6}}>
            <RadarCard>
              <Typography variant="h2" margin={2}>Study routes</Typography>
              <Grid container spacing={2} margin={2}>
                {studies?.map((study: string) => (
                  <Grid size={{xs: 12, md: 6}}>
                    <Button href={`/${study}`} fullWidth variant="contained" LinkComponent={Link}>{study}</Button>
                  </Grid>
                ))}
              </Grid>
            </RadarCard>
          </Grid>
        </Grid>
        </Container>
      </Box>
    </main>
    <Footer columns={[]} copyrightText="© RADAR-base, all rights reserved"/>
    </Box>
  );
}