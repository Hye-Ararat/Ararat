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
import { grey, red } from '@material-ui/core/colors';
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
          background:{
            default: prefersDarkMode ? '#0d141d' : '#fff',
            paper: prefersDarkMode ? '#141c26' : ""
          },
          primary: {
            main: blue[500]
          },
          success: {
            main: prefersDarkMode ? '#163a3a' : green[500],
            contrastText: prefersDarkMode ?'#1ee0ac' : '#fff'
          },
          error: {
            main: prefersDarkMode ? '#34242b' : red[500],
            contrastText: prefersDarkMode ? '#e85347' : '#fff'
          }
        },
        typography: {
          fontFamily: [
            "Inter",
            "sans-serif"
          ].join(','),
          body2: {
            fontWeight: 500
          },
          normal: {
            fontWeight: 600
          },
          h4: {
            fontWeight: 700
            },
            h6: {
              fontWeight: 600
              },
            h5: {
              fontWeight: 600
            },
          },
        components: {
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: prefersDarkMode ? '#101924' : ""              }
            },
          },
          MuiTableHead: {
            styleOverrides:{
              root:{
                backgroundColor: prefersDarkMode ? '#28374b' : ""              }
            }
          },
          MuiListSubheader: {
            styleOverrides: {
              root: {
                backgroundColor: prefersDarkMode ? 'rgb(18, 18, 18)' : "",
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'              }
            }
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600
              }
            }
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                fontWeight: 500
              }
            }
          },
          MuiTextField:{
            styleOverrides:{
              root:{
                backgroundColor: '#28374b',
              borderRadius: 6,
              },
            }
          },
          MuiInput:{
            styleOverrides:{
              root:{
                borderRadius: 6,
                
              }
            }
          },
          MuiOutlinedInput: {
            styleOverrides:{
              root: {
                borderRadius: 6
              },
              notchedOutline:{
                borderRadius: 6,
                borderStyle: 'none',
                overflow: 'hidden'
              },
            },
          },
          MuiAppBar:{
            styleOverrides:{
              root:{
                background: prefersDarkMode ?'#101924' : blue['500'],
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'              
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
