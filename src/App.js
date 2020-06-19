import React from 'react'
import { Security } from '@okta/okta-react'

import config from './config'
import AppRouteAuthen from './views/AppRouteAuthen'

function App() {
  return (
      <Security {...config.oidc}>
        <AppRouteAuthen />
      </Security>
  )
}

App.displayName = 'App'

export default App
