"use client"
import React, { useContext, useEffect } from 'react'
import { Box, Button, Divider, IconButton, Link, Menu, MenuItem, Typography } from '@mui/material'
import { withBasePath } from '@/app/_lib/util/links'
import { ProtocolContext } from '@/app/_lib/study/protocol/provider.client'
import { ParticipantContext } from '@/app/_lib/auth/provider.client'
import { AccountCircleRounded } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

interface LoggedInMenuItemsProps {
  onClick?: () => void
}

function LoggedInMenuItems({onClick}: LoggedInMenuItemsProps) {
  const router = useRouter();
  return <React.Fragment>
        {/*    
        <MenuItem onClick={() => {
          handleCloseNavMenu()
        }}>
          My Account
        </MenuItem> */}
        <MenuItem 
          onClick={() => {
            onClick && onClick()
            fetch(withBasePath('/api/auth/logout')).then(
              () => {router.refresh()}
            )
        }}>
          <Typography color='error'>Sign Out</Typography>
        </MenuItem>
  </React.Fragment>
}

interface LoggedOutMenuItemsProps {
  onClick?: () => void
}

function LoggedOutMenuItems({onClick}: LoggedOutMenuItemsProps) {
  const protocol = useContext(ProtocolContext);
  const joinLink = withBasePath(`/${protocol.studyId}/enrol`)
  const signInLink = protocol.studyId ? withBasePath(`/${protocol.studyId}/login`) : withBasePath('/auth/login')
  return <React.Fragment>
    <MenuItem href={signInLink}>
      <Link color='primary' role='menuitem' href={signInLink} underline='none'>
        Sign In
      </Link>
    </MenuItem>
    <MenuItem>
      <Link color='primary' role='menuitem' href={joinLink} underline='none'>
        Join Study
      </Link>
    </MenuItem>
  </React.Fragment>  
}

interface LoggedInButtonsProps {
  studyId?: string
  flowDirection?: 'row' | 'column'
}

function LoggedInButtons(props: LoggedInButtonsProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  return <Box display={'flex'} flexDirection={props.flowDirection ?? 'row'} gap={2}>
    <IconButton
      size='small'
      aria-label='account of current user'
      aria-controls='menu-appbar'
      aria-haspopup='true'
      onClick={handleOpenNavMenu}
      color='inherit'>
      <AccountCircleRounded color='primary' fontSize='large' />
    </IconButton>
    <Menu
      id='menu-appbar'
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
    >
      <LoggedInMenuItems onClick={handleCloseNavMenu}/>

    </Menu>
  </Box>
}

interface AccountButtonProps {
  flowDirection?: "row" | "column"
}


export function AccountButton(props: AccountButtonProps) {
  const protocol = useContext(ProtocolContext);
  const participant = useContext(ParticipantContext);
  const loggedIn = participant?.loggedIn
  const signInLink = protocol.studyId ? withBasePath(`/${protocol.studyId}/login`) : withBasePath('/auth/login')
  const joinLink = withBasePath(`/${protocol.studyId}/enrol`)
  if (loggedIn) {
    return (
      <React.Fragment>
        <LoggedInButtons studyId={protocol.studyId ?? 'auth'} flowDirection={props.flowDirection} />
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <Button variant='outlined' href={signInLink} style={{'textWrap': 'nowrap'}}>Sign In</Button>
        <Button variant='contained' href={joinLink} style={{'textWrap': 'nowrap'}}>Join Study</Button>
      </React.Fragment>
    )
  }

}

export function AccountMenuItemsFragment() {
  const protocol = useContext(ProtocolContext);
  const participant = useContext(ParticipantContext);
  const loggedIn = participant?.loggedIn
  const signInLink = protocol.studyId ? withBasePath(`/${protocol.studyId}/login`) : withBasePath('/auth/login')
  if (loggedIn) {
    return <LoggedInMenuItems />
  } else {
    return <LoggedOutMenuItems />
  }
}