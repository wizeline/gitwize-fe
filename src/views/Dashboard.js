import { useOktaAuth } from '@okta/okta-react'
import React, { useState, useEffect } from 'react'
import { Button, Header } from 'semantic-ui-react'

const Dashboard = () => {
  const { authState, authService } = useOktaAuth()
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setUserInfo(null)
    } else {
      authService.getUser().then(info => {
        setUserInfo(info)
      })
    }
  }, [authState, authService])

  const login = async () => {
      alert('login')
    authService.login('/')
  }

  if (authState.isPending) {
    return <div> Loading ...</div>
  }

  return (
    <div>
      <div>
        <Header as="h1">PKCE Flow w/ Okta Hosted Login Page</Header>
      </div>
      {authState.isAuthenticated && userInfo && (
        <div>
          <p>
            Welcome back,
            {userInfo.name}
          </p>
          <p>
            <a href="/profile">My Profile</a>
          </p>
        </div>
      )}
      {!authState.isAuthenticated && (
        <Button id="login-button" primary onClick={login}>
          Login
        </Button>
      )}
    </div>
  )
}

export default Dashboard
