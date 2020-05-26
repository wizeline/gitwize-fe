import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Security, LoginCallback } from '@okta/okta-react'
import { Container } from 'semantic-ui-react'

import Home from './pages/Home'
import config from './config'

function App() {
  return (
    <Router>
      <Security {...config.oidc}>
        <Container>
          <Route path="/" component={Home} />
          <Route path="/implicit/callback" component={LoginCallback} />
        </Container>
      </Security>
    </Router>
  )
}

App.displayName = 'App'

export default App
