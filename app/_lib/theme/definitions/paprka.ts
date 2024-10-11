"use client"
import { BorderBottom } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';
import { Montserrat } from "next/font/google";

const msrt_font = Montserrat({
  subsets: ['latin']
})

const paprkaOptions = createTheme({
  typography: {
    allVariants: {
      fontFamily: msrt_font.style.fontFamily,
      wordBreak: 'break-word',
      whiteSpace: "pre-wrap"
    },
    h1: {
      fontSize: '2rem',
      fontWeight: '700',
      color: "#0297A7",
      wordBreak: 'normal',
      overflow: 'hidden'
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: "#0297A7",
    },
    h3: {
      fontSize: '1rem',
      fontWeight: '700',
      color: "#0297A7",
    },
    h4: {
      fontSize: '1rem',
      fontWeight: '700',
    },
    button: {
      textTransform: 'none',
      wordBreak: 'normal',
    },
    body1: {
    },
    body2: {
    }
  },
  palette: {
    background: {
      default: "#f2f2f7"
    },
    primary: {
      light: '#2C82C5',
      main: '#0297A7',
      dark: '#066B76',
      contrastText: '#fff',
    },
    secondary: {
      light: '#e8e675',
      main: '#adb53f',
      dark: '#808400',
      contrastText: '#fff',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        sx: {borderRadius: 2}
      }
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: 'static',
      }
    },
  }
})

export default paprkaOptions