import React, {useState} from 'react'
import { CssBaseline } from '@material-ui/core'
import {  createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import AppRouteAuthen from './views/AppRouteAuthen'
import {AuthenticationContextProvider, isTokenValidate, isAuthPending} from './hooks/authService'

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

const userInitValue = JSON.parse(localStorage.getItem('userProfile'))

function App() {
  const [userInfor, setUserInfor] = useState(userInitValue)
  const [tokenObj, setTokenObj] = useState()
  const [authResponse, setAuthResponse] = useState()
  const authenticationContextValue = {
    authenticationState: {
      isAuthenticated: isTokenValidate(tokenObj),
      isPending: isAuthPending(authResponse),
    },
    userInfor: userInfor,
    authResponse: authResponse,
    tokenObj: tokenObj,
    login: (response) => {
      console.log('login', response)
      handleLogin(response)
    },
    logout: (redirectUri) => {
      console.log('logout')
      handleLogout(redirectUri)
    }
  }
  
  const handleLogin = (response) => {
    localStorage.setItem('token', response.tokenObj.id_token);
    // localStorage.setItem('tokenExpirationTime', response.tokenObj.expires_at);
    localStorage.setItem('userProfile', JSON.stringify(response.profileObj))
    setUserInfor(response.profileObj)
    setTokenObj(response.tokenObj)
    setAuthResponse(response)
  }
  
  const handleLogout = (redirectUri) => {
    setAuthResponse(null)
    setUserInfor(null)
    setTokenObj(null)
    localStorage.clear()
    sessionStorage.clear()
    window.location = redirectUri
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
