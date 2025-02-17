"use client"
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material/styles'
import { ReactNode } from 'react'

interface ThemeProviderFromObjectProps {
  children: ReactNode
  themeObject: any
}

export default function ThemeProviderFromObject({children, themeObject}: ThemeProviderFromObjectProps) {
  const theme = createTheme(themeObject)
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>)
}