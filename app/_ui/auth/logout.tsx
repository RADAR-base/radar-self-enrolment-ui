"use client"
import { withBasePath } from "@/app/_lib/util/links"
import { Button } from "@mui/material"
import { useState, useEffect } from "react"

interface LogoutProps {
  onLogout?: () => void
}

export function LogoutButton(props: LogoutProps) {
  const onLogout = props.onLogout ? props.onLogout : () => window.location.reload();

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

  return <Button
    color="error"
    onClick={() => {
      logout().then(
        (res) => {
          if (res.status==204) {
            onLogout()
          }
        }
      )
    }}
  >
    Logout
  </Button>
}