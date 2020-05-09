import { useOktaAuth } from '@okta/okta-react'
import React, { useState, useEffect } from 'react'
import { Button, Header } from 'semantic-ui-react'
import styles from './Home.module.css'

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
    authService.login('/')
  }

  if (authState.isPending) {
    return <div> Loading ...</div>
  }

  return (
    <div className={styles.login}>
      <div>
        <Header as="h1">Login page</Header>
      </div>
      {authState.isAuthenticated && userInfo && (
        <div>
          <p>
            Logged in, Welcome back,
            {userInfo.name}
          </p>
          <p>
            Token:
            <br />
            {authState.accessToken}
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
