import logo from './logo.svg';
import './App.css';
import AppRouter from './Router'
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import {blue, green} from '@mui/material/colors'
import CssBaseline from '@material-ui/core/CssBaseline';
import { getPerformance } from "firebase/performance";
import {getFirestore, enableMultiTabIndexedDbPersistence} from '@firebase/firestore'


// Import the functions you need from the SDKs you need
import Firebase from './components/db'
const database = getFirestore()
var per= getPerformance(Firebase)
enableMultiTabIndexedDbPersistence(database).catch((error) =>{
  console.log(error)
})
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          background: {
            default: prefersDarkMode ? '#121212' : '#fff'
          },
          primary: {
            main: blue[500]
          },
          success: {
            main: '#4bca81'
          }
        },
        typography: {
          fontFamily: [
            "Inter",
            "sans-serif"
          ].join(','),
          h4: {
            fontWeight: 700
            },
            h5: {
              fontWeight: 600
            },
          },
        components: {
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
              }
            },
          },
          MuiListSubheader: {
            styleOverrides: {
              root: {
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
              }
            }
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600
              }
            }
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: '600'
              },
              contained: {
                boxShadow: 'none',
                '&:active': {
                  boxShadow: 'none',
                },
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                backgroundColor: 'rgb(255,255,255,0.15)',
              },
            },
          },
        },
        
      }),
    [prefersDarkMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

    <AppRouter />
    </ThemeProvider>
  );
}

export default App;
