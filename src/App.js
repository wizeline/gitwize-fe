import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Security, LoginCallback } from '@okta/okta-react'
import { Container } from 'semantic-ui-react'

import RepostiryStats from './pages/RepositoryStats'

import Home from './views/Home'

import config from './config'

function App() {
  return (
    <Router>
      <Security {...config.oidc}>
        <Container>
          <Route path="/" exact component={Home} />
          <Route path="/implicit/callback" component={LoginCallback} />
          <Route path="/repository-stats" component={RepostiryStats}/>
        </Container>
      </Security>
    </Router>
  )
}

App.displayName = 'App'

export default App
