"use client"
import { createTheme } from '@mui/material/styles';
import { Inter } from "next/font/google";

const font = Inter({
  weight: ['400', '700'],
  subsets: ['latin']
})

export const defaultTheme = createTheme({
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
    fontFamily: font.style.fontFamily,
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
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: 'text'},
              style: {
                ":hover": {
                  "background-color": '#000000'
                }
              }
            }
          ]
        }
      },
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

export default defaultTheme