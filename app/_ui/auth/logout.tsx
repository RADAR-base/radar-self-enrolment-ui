"use client"
import { Button } from "@mui/material"

import Auth from '@/app/_lib/auth'

const auth = new Auth();

export function LogoutButton() {

  return <Button
    color="error"
    onClick={() => {auth.logOut().then((ok) => ok ? location.reload() : null)}}
  >
    Logout
  </Button>
}