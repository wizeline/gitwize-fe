import { useOktaAuth } from '@okta/okta-react'
import React, { useState, useEffect } from 'react'
import { CssBaseline } from '@material-ui/core'
import MainFrame from './MainFrame'
import Login from './Login'

const Dashboard = () => {
  const { authState, authService } = useOktaAuth()
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setUserInfo(null)
    } else {
      authService.getUser().then((info) => {
        setUserInfo(info)
      })
    }
  }, [authState, authService])

  const login = async () => {
    authService.login('/')
  }

  const logout = async () => {
    authService.logout('/')
  }

  if (authState.isPending) {
    return <div> Loading ...</div>
  }

  return (
    <div>
      <CssBaseline />
      {authState.isAuthenticated && userInfo && <MainFrame handleLogout={() => logout()} />}
      {!authState.isAuthenticated && <Login handleLogin={() => login()} />}
    </div>
  )
}

export default Dashboard
