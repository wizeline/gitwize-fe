import React from 'react'
import { Security } from '@okta/okta-react'
import { CssBaseline } from '@material-ui/core'
import {  createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import config from './config'
import AppRouteAuthen from './views/AppRouteAuthen'

const theme = createMuiTheme({  
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto',
          fontFamily: 'Poppins'
        },
        body: {
          fontFamily: 'Poppins'
        }
      },
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Security {...config.oidc}>
        <AppRouteAuthen />
      </Security>
    </ThemeProvider>
  )
}

App.displayName = 'App'

export default App
