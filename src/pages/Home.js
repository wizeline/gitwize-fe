import { useOktaAuth } from '@okta/okta-react'
import React, { useState, useEffect } from 'react'
import { PageProvider } from '../contexts/PageContext'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import RepositoryList from '../views/RepositoryList'
import RepositoryStats from '../pages/RepositoryStats'
import PullRequestStats from '../pages/PullRequestStats'
import QuartelyTrends from '../pages/QuartelyTrends'
import {MainLayoutContexProvider} from '../contexts/MainLayoutContext'
import ContributorStatsPage from '../pages/ContributorStatsPage'
import NotFoundError404 from '../pages/NotFoundError404'
import Navbar from '../views/Navbar'
import Loading from '../components/Loading'
import { ApiClient } from '../apis'
import CodeChangeVelocity from './CodeChangeVelocity';
import WeeklyImpact from './WeeklyImpact';

const theme = createMuiTheme({  
  typography: {
    fontFamily: 'Poppins',
    button: {
      textTransform: 'none'
    }
  },
  overrides: {
    MuiTypography: {
      body1: {
        fontSize: 'unset',
      },
    }
  }
});

const apiClient = new ApiClient()

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}))

const subMenuItems = [
  {
    name: 'Impact', 
    uri: '/impact', 
    children: [
      {
        name: 'Weekly Impact', 
        uri: '/weekly-impact', 
        component: WeeklyImpact
      }
    ]
  },
  {
    name: 'Code Change Velocity', 
    uri: '/code-change-velocity', 
    component: CodeChangeVelocity
  },
  {
    name: 'Repository Stats', 
    uri: '/repository-stats', 
    component: RepositoryStats
  },
  {
    name: 'Pull Requests',
    uri: '/pull-request',
    children: [
      {
        name: 'Pull Request Stats', 
        uri: '/pull-request-stats',
        component: PullRequestStats
      },
      {
        name: 'Quarterly Trends', 
        uri: '/quartely-trends', 
        component: QuartelyTrends
      }
    ]
  },
  {
    name: 'Contributors', 
    uri: '/contributor-stats',
    children: [
      {
        name: 'Contributor Stats', 
        uri: '/Contributors-stats',
        component: ContributorStatsPage
      }
    ]
  },
];

const buildRoutPath = (menuItems, baseURI='') => {
  return menuItems.flatMap(item => {
    if(item.children) {
      return buildRoutPath(item.children, item.uri)
    } else {
      return {
        uri: baseURI+item.uri,
        component: item.component
      }
    }
  })
}

const Home = () => {
  const { authState, authService } = useOktaAuth()
  const tokenManager = authService.getTokenManager()
  const [userInfo, setUserInfo] = useState(null)
  const [repositoryId, setRepositoryId] = useState()
  const [repositoryList, setRepositoryList] = useState()
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

  useEffect(() => {
    if(repositoryId) {
      apiClient.setTokenManager(tokenManager)
      if(repositoryList === undefined) {
        apiClient.repos.getRepoDetail(repositoryId).then((data) => {
          setRepositoryList([data])
        })
      }
    }
  }, [repositoryId, repositoryList, tokenManager])

  const logout = async () => {
    authService.logout('/')
  }

  const handleChangeRepoId = (repoId) => {
    setRepositoryId(repoId)
  }

  const handleShowNavbar = (showNav) => {
    setShowNavbar(showNav)
  }

  const handleChangeRepoList = (repoList) => {
    setRepositoryList(repoList)
  }

  const mainLayOutContextValue = {
    repositoryId: repositoryId,
    handleChangeRepositoryId: (repoId) => {
      handleChangeRepoId(repoId)
    },

    showNavbar: showNavbar,
    handleShowNavbar: (showNav) => {
      handleShowNavbar(showNav)
    },

    repoList: repositoryList,
    handleChangeRepoList: handleChangeRepoList
  }

  if (authState.isPending || userInfo === null) {
    return <Loading />
  }

  return (
    <div className={classes.root}>
    <PageProvider>
      <MuiThemeProvider theme={theme}>
      <MainLayoutContexProvider value={mainLayOutContextValue}>
      <Router>
        <Navbar subMenuItems={subMenuItems} userInfor={userInfo} handleLogout={logout} />
        <Container>
          <Switch>
            <Route path="/" exact component={RepositoryList} />
              {buildRoutPath(subMenuItems).map((item, index) => (
            <Route
              exact
              key={item.uri}
              path={`/repository/:id${item.uri}`}
              component={item.component}
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

export default Home
