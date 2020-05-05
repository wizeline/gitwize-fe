import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react'
import { Container } from 'semantic-ui-react'
import config from './config'
import Navbar from './views/Navbar'
import Home from './views/Home'
import Profile from './views/Profile'

const App = () => (
  <Router>
    <Security {...config.oidc}>
      <Navbar />
      <Container text style={{ marginTop: '7em' }}>
        <Route path="/" exact component={Home} />
        <Route path="/implicit/callback" component={LoginCallback} />
        <SecureRoute path="/profile" component={Profile} />
      </Container>
    </Security>
  </Router>
)
export default App
