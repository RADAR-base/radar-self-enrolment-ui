"use client"
import { RadarCardProps } from '@/app/_ui/components/base/card';
import { createTheme, Theme } from '@mui/material/styles';
import { OverridesStyleRules } from '@mui/material/styles/overrides';
import { Inter } from "next/font/google";

const font = Inter({
  weight: ['400', '700'],
  subsets: ['latin']
})

export const defaultOptions = createTheme({
  palette: {
    background: {
      default: "#f2f2f7"
    },
    primary: {
      main: '#23a2c9',
      dark: '#005969',
      light: '#84d8f4',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffa326',
      dark: '#ee6705',
      light: '#ffdeb1',
      contrastText: '#111',
    }
  },
  typography: {
    allVariants: {
      fontFamily: font.style.fontFamily,
      wordBreak: 'break-word',
    },
    h1: {
      fontSize: '1.8rem',
      fontWeight: 700,
      color: '#23a2c9',
      wordBreak: 'normal',
      overflow: 'hidden'
    },
    h2: {
      color: '#23a2c9',
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h3: {
      fontSize: '1rem',
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      }
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 2,
        position: 'static'
      }
    }
  }
})

export default defaultOptions