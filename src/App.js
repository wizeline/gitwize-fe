import React from 'react'
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom'
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react'
import { Container } from 'semantic-ui-react'
import config from './config'
import Navbar from './views/Navbar'
import Dashboard from './views/Dashboard';
import Profile from './views/Profile';

const HasAccessToRouter = () => {
  const history = useHistory()

  const customAuthHandler = () => {
    history.push('/login')
  }

  return (
    <Security {...config.oidc}>
      <Navbar />
      <Container text style={{ marginTop: '7em' }}>
        <Route path="/" exact component={Dashboard} />
        <Route path="/implicit/callback" component={LoginCallback} />
        <Route path="/profile" component={Profile} />
      </Container>
    </Security>
  )
}

const App = () => (
  <div>
    <Router>
      <HasAccessToRouter />
    </Router>
  </div>
)

export default App
