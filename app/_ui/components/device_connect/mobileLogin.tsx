"use client"
import { Box, Button, Link } from "@mui/material"
import React, { useEffect, useState } from "react"

export type MobilePlatform = "ios" | "android" | "other"

export function detectMobilePlatform(userAgent: string): MobilePlatform {
  if (/iphone|ipad|ipod/i.test(userAgent)) return "ios"
  if (/android/i.test(userAgent)) return "android"
  return "other"
}

export function useMobilePlatform(): { platform: MobilePlatform, isMobile: boolean } {
  const [platform, setPlatform] = useState<MobilePlatform>("other")

  useEffect(() => {
    setPlatform(detectMobilePlatform(navigator.userAgent))
  }, [])

  return { platform, isMobile: platform === "ios" || platform === "android" }
}

interface MobileLoginButtonProps {
  authUrl?: string
  label?: string
}

export function MobileLoginButton({ authUrl, label = "Log in to the app" }: MobileLoginButtonProps) {
  return (
    <Button
      component={Link}
      href={authUrl ?? "#"}
      variant="contained"
      color="primary"
      size="large"
      fullWidth
      disabled={authUrl == undefined}
      sx={{ my: 1 }}
    >
      {label}
    </Button>
  )
}

interface CollapsibleFallbackProps {
  toggleLabel?: string
  children: React.ReactNode
}

export function CollapsibleManualLogin({ toggleLabel = "Having trouble? Show manual login details", children }: CollapsibleFallbackProps) {
  const [show, setShow] = useState(false)
  return (
    <Box>
      <Button variant="text" size="small" onClick={() => setShow(s => !s)} sx={{ mt: 1 }}>
        {show ? "Hide manual login details" : toggleLabel}
      </Button>
      {show && <Box mt={1}>{children}</Box>}
    </Box>
  )
}
