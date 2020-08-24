import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import NotFoundError404 from '../pages/NotFoundError404'
import Home from '../pages/Home'
import LandingPage from '../pages/LandingPage'
import {useAuth} from '../hooks/authService'

export default function AppRouteAuthen() {
  const { authState } = useAuth()

  return (
    <Router>
      <Switch>
        {!authState.isAuthenticated && <Route exact path="/" component={LandingPage} />}
        {authState.isAuthenticated && <Route path="/" component={Home} />}
        <Route component={NotFoundError404} />
      </Switch>
    </Router>
  )
}
