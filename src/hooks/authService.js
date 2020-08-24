import React, { useContext } from 'react'


export const isTokenValidate = (tokenExpireTime) => {
  if(tokenExpireTime && tokenExpireTime > (new Date()).getTime()) {
    return true
  } else {
    return false
  }
}

const initialValue = {
  authenticationState: {
    isAuthenticated: isTokenValidate(localStorage.getItem('tokenExpiretime'))
  },
  userInfor: null,
  login: () => {},
  logout: () => {}
}
const AuthenticationContext = React.createContext(initialValue)

const handleRenewToken = (accessToken) => {
  //TODO: Implement refresh token
  return Promise.resolve('token')
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
          get: (key) => {
            return Promise.resolve(authenticationContext.userInfor._token[key])
          },
          getToken: () => {
            return Promise.resolve({
              token: authenticationContext.userInfor._token['idToken'],
              expireTime: authenticationContext.userInfor._token['expiresAt'],
            })
          },
          renew: (key) => {
            return handleRenewToken(authenticationContext.userInfor._token[key])
          }
        }
      }
    }
  }
}