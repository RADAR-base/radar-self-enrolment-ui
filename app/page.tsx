"use server"
import React, { useState } from "react";

import { Card, Button, Box, styled, Paper, Typography, Container, Popover, TextField } from "@mui/material";
import Grid from '@mui/material/Grid2'; // Grid version 2
import { RadarCard } from "./_ui/components/base/card";
import NavBar from "@/app/_ui/components/navbar/navbar";
import Auth from '@/app/_lib/auth';
import AuthServer from '@/app/_lib/auth/ory/service.server'
import LoginComponent, { LoginModal } from "./_ui/auth/login";
import { Footer } from "./_ui/components/footer";
import { LogoutButton } from "./_ui/auth/logout";

const auth = new Auth(); 
const authServer = new AuthServer();

export default async function Home() {
  const session = await authServer.getEmail()
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
      <Box sx={{ flexGrow: 1, margin: {xs: 0, sm: 2}}} 
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
                  <Button href="auth/signup" fullWidth variant="contained">Sign Up</Button>
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <Button href="auth/login" fullWidth variant="contained">Login</Button>
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <LoginModal></LoginModal>
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <LogoutButton />
                </Grid>
              </Grid>
            </RadarCard>
          </Grid>
          <Grid size={{xs: 12, sm: 6}}>
            <RadarCard>
              <Typography variant="h2" margin={2}>Study routes</Typography>
              <Grid container spacing={2} margin={2}>
                <Grid size={{xs: 12, md: 6}}>
                  <Button href="study/asdfg" fullWidth variant="contained">Random string</Button>
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <Button href="study/paprka" fullWidth variant="contained">PAPrKA</Button>
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <Button href="study/test" fullWidth variant="contained">Test</Button>
                </Grid>
              </Grid>
            </RadarCard>
          </Grid>
          <Grid size={12}>
            <RadarCard>{JSON.stringify(session, null, 2)}</RadarCard>
          </Grid>
          <Grid size={12}>
            <RadarCard><TextField id='test' label='Test'></TextField></RadarCard>
          </Grid>
        </Grid>
        </Container>
      </Box>
    </main>
    <Footer columns={[]} copyrightText="© RADAR-base, all rights reserved"/>
    </Box>
  );
}