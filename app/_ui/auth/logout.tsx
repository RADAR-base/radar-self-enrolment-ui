"use client"
import { Button } from "@mui/material"

import Auth from '@/app/_lib/auth'


export function LogoutButton() {

  return <Button
    color="error"
    onClick={() => {
      const auth = new Auth();
      auth.logOut().then((ok) => ok.ok ? location.reload() : null)
    }}
  >
    Logout
  </Button>
}