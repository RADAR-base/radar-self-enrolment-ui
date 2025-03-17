"use client"
import React, { useContext, useEffect } from 'react'
import { Box, Button, IconButton, Link, Menu, MenuItem, Typography } from '@mui/material'
import { withBasePath } from '@/app/_lib/util/links'
import { ProtocolContext } from '@/app/_lib/study/protocol/provider.client'
import { ParticipantContext } from '@/app/_lib/auth/provider.client'
import { AccountCircleRounded } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

interface LoggedInButtonsProps {
  studyId?: string
}

function LoggedInButtons(props: LoggedInButtonsProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const router = useRouter();
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
   
        <MenuItem onClick={() => {
          handleCloseNavMenu()
        }}>
          My Account
        </MenuItem>

        <MenuItem onClick={() => {
          handleCloseNavMenu()
          fetch(withBasePath('/api/auth/logout')).then(
            () => {router.refresh()}
          )
        }}>
          Sign Out
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
    {loggedIn ? <LoggedInButtons studyId={protocol.studyId ?? 'auth'}/> : <Button variant='outlined' href={signInLink} style={{'textWrap': 'nowrap'}}>Sign In</Button>}
  </div>
}