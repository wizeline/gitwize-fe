import React from 'react'
import { Switch, BrowserRouter as Router, Route, useHistory } from 'react-router-dom'
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react'
import { Container } from 'semantic-ui-react'
import config from './config'
import Navbar from './views/Navbar'
import Dashboard from './views/Dashboard';
import Profile from './views/Profile';

const HasAccessToRouter = () => {
  const history = useHistory()

  const customAuthHandler = () => {
    history.push('/profile')
  }

  return (
    <Security {...config.oidc}>
      <Navbar />
      <Switch> 
        <Route path="/" exact component={Dashboard} />
        <Route path="/implicit/callback" component={LoginCallback} />
        <Route path="/profile" component={Profile} />
      </Switch>
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
