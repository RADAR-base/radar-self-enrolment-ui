"use client"
import { withBasePath } from "@/app/_lib/util/links"
import { Button } from "@mui/material"
import { useState, useEffect } from "react"

interface LogoutProps {
  onLogout?: () => void
}

export function LogoutButton(props: LogoutProps) {
  const onLogout = props.onLogout ? props.onLogout : () => window.location.reload();
  let [flow, setFlow] = useState<any>();

  const getFlow = async (setFlow: (v: any) => void) => {
    const response = await fetch(withBasePath('/api/ory/logout/browser'))
    if (response.ok) {
      const data = await response.json()
      setFlow(data)
    }
  }

  const logout = async (): Promise<Response> => {
    const res = await fetch(withBasePath('/api/ory/logout?') + 
        new URLSearchParams({
          logout_token: flow['logout_token']
        })
    )
    return res
  }

  useEffect(() => {
    if (flow === undefined) {
      getFlow(setFlow)
    }
  }, [flow])

  return <Button
    color="error"
    disabled={flow === undefined}
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