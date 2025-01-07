"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'

import { AppBar, Box, Button, Container, Divider, IconButton, Link, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { withBasePath } from '@/app/_lib/util/links'

interface NavBarProps {
  title?: string;
  logo_src?: string;
  bgcolor?: string;
  color?: string;
  links?: {text: string, href: string}[];
};

function NavBar(props: NavBarProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
  <AppBar color='inherit'>
    <Container maxWidth='lg' sx={{padding: 2}}> 
      <Toolbar variant='dense' disableGutters>
        <Box  flexGrow={1}          // Large & small title
              display={'flex'}
              flexDirection='row'
              justifyContent='flex-start'
              alignItems='center'
              gap={2}
              paddingRight={4}
        >
            {props.logo_src && 
            <Box height={"3rem"}>
              <img src={withBasePath(props.logo_src)} alt='Study logo' height={"100%"}></img>
              {/* <Image src={withBasePath(props.logo_src)} alt='Study logo' fill={true} objectFit='contain'/> */}
            </Box>
            }
            <Typography variant="h1" align="center">
              {props.title}
            </Typography>
        </Box>
        {props.links && 
        <Box flexGrow={1}            // Small Menu
              flexDirection='row'
              alignItems='center'
              justifyContent='flex-end'
              sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
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
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            {props.links?.map((link, i) => (
              <MenuItem
                key={i}>
                <Typography sx={{ textAlign: 'center' }}>
                  <NextLink href={link.href} passHref legacyBehavior>
                    <Link underline='none' variant='button' sx={{textTransform: 'none'}}  onClick={handleCloseNavMenu}>
                      {link.text}
                    </Link>
                  </NextLink>
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        }
        <Box  flexGrow={1}            // Large menu
              flexDirection='row'
              alignItems='center'
              justifyContent='flex-end'
              gap={2}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
          {props.links?.map(
            (link, i) => {
              return (
                <NextLink href={link.href} passHref legacyBehavior key={i}>
                  <Button sx={{textTransform: 'none'}}>{link.text}</Button>
                </NextLink>)
            }
          )}
        </Box>
      </Toolbar>
    </Container>
    <Divider style={{width: '100%', paddingLeft: 0}}/>
  </AppBar>
)}

export default NavBar;