import React from 'react'
import { Security } from '@okta/okta-react'

import config from './config'
import AppWithRouterAccess from './views/AppWithRouterAccess'

function App() {
  return (
      <Security {...config.oidc}>
        <AppWithRouterAccess />
      </Security>
  )
}

App.displayName = 'App'

export default App
