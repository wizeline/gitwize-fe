import { useOktaAuth } from '@okta/okta-react'
import React, { useState, useEffect } from 'react'
import { CssBaseline } from '@material-ui/core'
import { PageProvider } from '../contexts/PageContext'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import RepositoryList from '../views/RepositoryList'
import RepositoryStats from '../pages/RepositoryStats'
import PullRequestStats from '../pages/PullRequestStats'
import {MainLayoutContexProvider} from '../contexts/MainLayoutContext'
import ContributorStatsPage from '../pages/ContributorStatsPage'
import NotFoundError404 from '../pages/NotFoundError404'
import Navbar from '../views/Navbar'
import Loading from '../components/Loading'

const theme = createMuiTheme({  
  typography: {
    fontFamily: 'Poppins',
    button: {
      textTransform: 'none'
    }
  },
});

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}))

const subMenuItem = [
  {name: 'Repository stats', uri: '/repository-stats', component: RepositoryStats},
  {name: 'Pull request stats', uri: '/pull-request-stats', component: PullRequestStats}, 
  {name: 'Contributor stats', uri: '/contributor-stats', component: ContributorStatsPage},
  // {name: 'Inactivity', uri: '/inactivity'},
  // {name: 'Code churn/frequency', uri: '/code-churn-frequency'},
  // {name: 'Commit activity trend', uri: '/commit-activity-trend'},
  // {name: 'Velocity', uri: '/velocity'}
];

const Dashboard = () => {
  const { authState, authService } = useOktaAuth()
  const [userInfo, setUserInfo] = useState(null)
  const [repositoryId, setRepositoryId] = useState()
  const [showNavbar, setShowNavbar] = useState(true)
  const classes = useStyles()

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setUserInfo(null)
    } else {
      authService.getUser().then((info) => {
        setUserInfo(info)
      })
    }
  }, [authState, authService])

  const logout = async () => {
    authService.logout('/')
  }

  const handleChangeRepoId = (repositoryId) => {
    setRepositoryId(repositoryId)
  }

  const handleShowNavbar = (showNavbar) => {
    setShowNavbar(showNavbar)
  }

  const mainLayOutContextValue = {
    repositoryId: repositoryId,
    handleChangeRepositoryId: (repositoryId) => {
      handleChangeRepoId(repositoryId)
    },
    showNavbar: showNavbar,
    handleShowNavbar: (showNavbar) => {
      handleShowNavbar(showNavbar)
    }
  }

  if (authState.isPending || userInfo === null) {
    return <Loading />
  }

  return (
    <div className={classes.root}>
    <PageProvider>
      <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayoutContexProvider value={mainLayOutContextValue}>
      <Router>
        <Navbar subMenuItem={subMenuItem} userInfor={userInfo} handleLogout={logout} />
        <Container>
          <Switch>
            <Route path="/" exact component={RepositoryList} />
              {subMenuItem.map((subMenuItem, index) => (
            <Route
              exact
              key={subMenuItem.uri}
              path={`/repository/:id${subMenuItem.uri}`}
              component={subMenuItem.component}
            />
            ))}
            <Route component={NotFoundError404} />
          </Switch>
        </Container>
      </Router>
      </MainLayoutContexProvider>
      </MuiThemeProvider>
    </PageProvider>
    </div>
  )
}

export default Dashboard
