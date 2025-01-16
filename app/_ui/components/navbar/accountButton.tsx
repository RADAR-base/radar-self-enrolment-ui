"use client"
import React, { useContext, useEffect } from 'react'
import { Box, Button, IconButton, Link, Menu, MenuItem, Typography } from '@mui/material'
import { withBasePath } from '@/app/_lib/util/links'
import { ProtocolContext } from '@/app/_lib/study/protocol/provider.client'
import { ParticipantContext } from '@/app/_lib/auth/provider.client'
import { AccountCircleOutlined, AccountCircleRounded } from '@mui/icons-material'
import NextLink from 'next/link'


interface NavbarLogoutButtonProps {
  handleCloseMenu?: () => void
}

function NavbarLogoutButton(props: NavbarLogoutButtonProps) {
  const logout = async(): Promise<Response> => {
    const flowResponse = await fetch(withBasePath('/api/ory/logout/browser'))
    if (flowResponse.ok) {
      const flowData = await flowResponse.json()
      const logoutResponse = await fetch(withBasePath('/api/ory/logout?') + 
        new URLSearchParams({
          logout_token: flowData['logout_token']
        })
      )
      return logoutResponse
    } else {
      return flowResponse
    }

  }

  return <Typography sx={{ textAlign: 'center' }} color='error'>
      <Link underline='none' variant='button' sx={{textTransform: 'none'}}  
        onClick={() => {
          if (props.handleCloseMenu) {
            props.handleCloseMenu()
          }
          logout().then(
            (res) => {
              if (res.status==204) {
                window.location.reload()
              }
            }
          )
        }}>
        Sign Out
      </Link>
  </Typography>

}

interface LoggedInButtonsProps {
}

function LoggedInButtons(props: LoggedInButtonsProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  return <Box display={'flex'} flexDirection={'row'} gap={2}>
    <IconButton
      size='small'
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={handleOpenNavMenu}
      color="inherit">
      <AccountCircleRounded color='primary' fontSize='large' />
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
   
        <MenuItem>
          <Typography sx={{ textAlign: 'center' }}>
            <NextLink href={'#'} passHref legacyBehavior>
              <Link underline='none' variant='button' sx={{textTransform: 'none'}}  onClick={handleCloseNavMenu}>
                My Account
              </Link>
            </NextLink>
          </Typography>
        </MenuItem>

        <MenuItem>
          <NavbarLogoutButton handleCloseMenu={handleCloseNavMenu} />
        </MenuItem>

    </Menu>
  </Box>
}

interface AccountButtonProps {
  loggedIn?: boolean
}


export function AccountButton(props: AccountButtonProps) {
  const protocol = useContext(ProtocolContext);
  const participant = useContext(ParticipantContext);
  const loggedIn = participant?.loggedIn
  const signInLink = protocol.studyId ? withBasePath(`/${protocol.studyId}/login`) : withBasePath('/auth/login')
  return <div>
    {loggedIn ? <LoggedInButtons /> : <Button variant='outlined' href={signInLink} style={{'textWrap': 'nowrap'}}>Sign In</Button>}
  </div>
}