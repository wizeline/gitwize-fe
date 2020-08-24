import React, { useState, useEffect } from 'react'
import { PageProvider } from '../contexts/PageContext'
import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import RepositoryList from '../views/RepositoryList'
import RepositoryStats from '../pages/RepositoryStats'
import PullRequestStats from '../pages/PullRequestStats'
import QuartelyTrends from '../pages/QuartelyTrends'
import PullRequestSize from '../pages/PullRequestSize'
import {MainLayoutContexProvider} from '../contexts/MainLayoutContext'
import ContributorStatsPage from '../pages/ContributorStatsPage'
import NotFoundError404 from '../pages/NotFoundError404'
import Navbar from '../views/Navbar'
import { ApiClient } from '../apis'
import CodeChangeVelocity from './CodeChangeVelocity';
import WeeklyImpact from './WeeklyImpact';
import CodeQuality from './CodeQuality';
import { useAuth } from '../hooks/authService';

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
    name: 'Code Quality',
    uri: '/code-quality',
    component: CodeQuality
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
        name: 'Monthly Trends', 
        uri: '/monthly-trends', 
        component: QuartelyTrends 
      },
      {
        name: 'Pull Request Size', 
        uri: '/pull-request-size', 
        component: PullRequestSize
      },
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
        component: item.component,
        name: item.name
      }
    }
  })
}

const Home = () => {
  const { authState, authService} = useAuth()
  const [userInfo, setUserInfo] = useState({})
  const [repositoryId, setRepositoryId] = useState()
  const [repositoryList, setRepositoryList] = useState()
  const [showNavbar, setShowNavbar] = useState(true)
  const classes = useStyles()

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setUserInfo(null)
    } else {
      const info = authService.getUser()
      setUserInfo(info)
    }
  }, [authState, authService])

  useEffect(() => {
    if(repositoryId) {
      apiClient.setAuthService(authService)
      if(repositoryList === undefined) {
        apiClient.repos.getRepoDetail(repositoryId).then((data) => {
          setRepositoryList([data])
        })
      }
    }
  }, [repositoryId, repositoryList, authService])

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

  return (
    <div className={classes.root}>
    <PageProvider>
      <MuiThemeProvider theme={theme}>
      <MainLayoutContexProvider value={mainLayOutContextValue}>
      <Router>
        <Navbar subMenuItems={subMenuItems} userInfor={userInfo._profile} handleLogout={logout} />
        <Container>
          <Switch>
            <Route path="/" exact component={RepositoryList} />
              {buildRoutPath(subMenuItems).map((item, index) => {
                const Mycomponent = item.component
                return (
                  <Route
                    exact
                    key={item.uri}
                    path={`/repository/:id${item.uri}`}
                    render={props => <Mycomponent pageTitle={item.name} {...props}/>}
                  />
                )}
              )}
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
