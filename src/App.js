import logo from './logo.svg';
import './App.css';
import AppRouter from './Router'
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
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
