"use client"
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'

import { AppBar, Box, Button, Container, Divider, IconButton, Link, Menu, MenuItem, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { withBasePath } from '@/app/_lib/util/links'
import { AccountButton } from './accountButton'
import { ProtocolContext } from '@/app/_lib/study/protocol/provider.client'
import { ParticipantContext } from '@/app/_lib/auth/provider.client'
import { useRouter } from 'next/navigation'
import NextButton from '../base/nextButton'


interface MenuProps {
  links?: {text: string, href: string}[]
  loggedIn: boolean,
  studyId?: string
}

function SmallMenu(props: MenuProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const router = useRouter()
  return (
    <Box flexGrow={1}
         flexDirection='row'
         alignItems='center'
         justifyContent='flex-end'
         display='flex'>
      {(props.loggedIn && props.studyId) && <NextButton href={`/${props.studyId}/portal`}>Portal</NextButton>}
      <AccountButton />
      
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit">
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}>
        {props.links?.map((link, i) => (
          <MenuItem
            onClick={() => {
                handleCloseNavMenu()
                router.push(link.href)
              }
            }
            key={i}>
              {link.text}
          </MenuItem>
        ))}
        {(props.loggedIn && props.studyId) && 
        <MenuItem
          onClick={() => {
              handleCloseNavMenu()
              router.push(`/${props.studyId}/portal`)
            }
        }>
          Portal
        </MenuItem>
        }
      </Menu>
    </Box>
  )
}

function LargeMenu(props: MenuProps) {
  return (
    <Box flexGrow={1} flexDirection='row' alignItems='center' justifyContent='flex-end'
         gap={2} display='flex'>
      {props.links?.map((link, i) => <NextButton href={link.href} key={i}>{link.text}</NextButton>)}
      {(props.loggedIn && props.studyId) && <NextButton href={`/${props.studyId}/portal`}>Portal</NextButton>}
      <AccountButton />
    </Box>
  )
}

interface NavBarProps {
  title?: string;
  logo_src?: string;
  bgcolor?: string;
  color?: string;
  links?: {text: string, href: string}[];
};

function NavBar(props: NavBarProps) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const participant = useContext(ParticipantContext);
  const study = useContext(ProtocolContext)
  const router = useRouter()
  const onLogoClick = () => {
    console.log('hi')
    router.push(`/${study.studyId}`)
  }
  return (
  <AppBar color='inherit' sx={{'overflowX': 'auto'}}>
    <Container maxWidth='lg' sx={{padding: 2}}> 
      <Toolbar variant='dense' disableGutters>
        <Box  flexGrow={1}          // Large & small title
              display={'flex'}
              flexDirection='row'
              justifyContent='flex-start'
              alignItems='center'
              gap={2}
              paddingRight={4}>
          <Box onClick={onLogoClick} style={{cursor: 'pointer'}} display={'flex'}
               flexDirection={'row'} flexWrap={'nowrap'}
               alignItems={'center'} gap={1}>
            {props.logo_src &&
              <Box height={"3rem"}>
                <img src={withBasePath(props.logo_src)}
                    alt='Study logo' height={"100%"}>
                </img>
              </Box>
            }
            <Typography display={{'xs': 'none', 'md': 'block'}} variant="h1" align="center" style={{userSelect: 'none'}}>
              {props.title}
            </Typography>
          </Box>
        </Box>
        {matches ? <SmallMenu links={props.links} loggedIn={participant?.loggedIn ?? false} studyId={study.studyId} /> : <LargeMenu links={props.links} loggedIn={participant?.loggedIn ?? false} studyId={study.studyId} />}
      </Toolbar>
    </Container>
    <Divider style={{width: '100%', paddingLeft: 0}}/>
  </AppBar>
)}

export default NavBar;