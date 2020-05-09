import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Security, LoginCallback } from '@okta/okta-react'
import { Container } from 'semantic-ui-react'
import config from './config'
import Navbar from './views/Navbar'
import Home from './views/Home'
import RepositoryList from './views/RepositoryList'

const App = () => (
  <Router>
    <Security {...config.oidc}>
      <Container text style={{ marginTop: '7em' }}>
        <Route path="/" exact component={RepositoryList} />
        <Route path="/implicit/callback" component={LoginCallback} />
      </Container>
    </Security>
  </Router>
)
export default App
