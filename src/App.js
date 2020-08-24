import React, {useState} from 'react'
import { CssBaseline } from '@material-ui/core'
import {  createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import AppRouteAuthen from './views/AppRouteAuthen'
import {AuthenticationContextProvider, isTokenValidate} from './hooks/authService'

const theme = createMuiTheme({  
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto',
          fontFamily: 'Poppins'
        },
        body: {
          fontFamily: 'Poppins'
        }
      },
    },
  },
});

const tokenInitValue = JSON.parse(localStorage.getItem('tokenObject'))

function App() {
  const [userInfor, setUserInfor] = useState(tokenInitValue)
  const authenticationContextValue = {
    authenticationState: {
      isAuthenticated: isTokenValidate(localStorage.getItem('tokenExpirationTime')),
    },
    userInfor: userInfor,
    login: (userInfor) => {
      console.log('login', userInfor)
      handleLogin(userInfor)
    },
    logout: () => {
      console.log('logout')
      handleLogout()
    }
  }
  
  const handleLogin = (userInfor) => {
    localStorage.setItem('token', userInfor.token.idToken);
    localStorage.setItem('tokenExpirationTime', userInfor.token.expiresAt);
    localStorage.setItem('tokenObject', JSON.stringify(userInfor))
    setUserInfor(userInfor)
  }
  
  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    setUserInfor(null)
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthenticationContextProvider value ={authenticationContextValue}>
        <CssBaseline />
        <AppRouteAuthen/>
      </AuthenticationContextProvider>
    </ThemeProvider>
  )
}

App.displayName = 'App'

export default App
