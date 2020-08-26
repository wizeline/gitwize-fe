import React, { useContext } from 'react'


export const isTokenValidate = (tokenObject) => {
  console.log(tokenObject)
  if(tokenObject) {
    const tokenExpireTime = tokenObject.expires_at
    if(tokenExpireTime && tokenExpireTime > (new Date()).getTime()) {
      return true
    } else {
      return false
    }
  }
  return false
}

export const isAuthPending = (authResponse) => {
  const tokenStorage = localStorage.getItem('token')
  return (tokenStorage && !authResponse) ? true : false
}

const initialValue = {
  authenticationState: {
    isAuthenticated: () => {},
    isPending: () => {}
  },
  userInfor: null,
  tokenObj: null,
  authResponse: null,
  login: () => {},
  logout: () => {}
}
const AuthenticationContext = React.createContext(initialValue)

const handleRenewToken = (authResponse) => {
  const newAuth = authResponse.reloadAuthResponse()
  return Promise.resolve(newAuth)
}

export const AuthenticationContextProvider = AuthenticationContext.Provider
export const AuthenticationContextConsumer = AuthenticationContext.Consumer

export const useAuth = () => {
  const authenticationContext = useContext(AuthenticationContext)
  return {
    authState: authenticationContext.authenticationState,
    authService: {
      login: authenticationContext.login,
      logout: authenticationContext.logout,
      getUser: () => {
        return authenticationContext.userInfor
      },
      getTokenManager: () => {
        return {
          getToken: () => {
            return Promise.resolve({
              token: authenticationContext.tokenObj['id_token'],
              expireTime: authenticationContext.tokenObj['expires_at'],
            })
          },
          renew: () => {
            return handleRenewToken(authenticationContext.authResponse)
          }
        }
      }
    }
  }
}