import React, { useState} from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container';

import RepositoryList from './RepositoryList'
import RepositoryStats from '../pages/RepositoryStats'
import PullRequestStats from '../pages/PullRequestStats'
import {MainLayoutContexProvider} from '../contexts/MainLayoutContext'
import ContributorStatsPage from '../pages/ContributorStatsPage'

import Navbar from './Navbar'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}))

function MainLayout(props) {
  const {handleLogout, userInfor} = props;
  const classes = useStyles()

  const [repositoryId, setRepositoryId] = useState()

  const subMenuItem = [
    {name: 'Repository stats', uri: '/repository-stats', component: RepositoryStats},
    {name: 'Pull request stats', uri: '/pull-request-stats', component: PullRequestStats}, 
    {name: 'Contributor stats', uri: '/contributor-stats', component: ContributorStatsPage},
    {name: 'Inactivity', uri: '/inactivity'},
    {name: 'Code churn/frequency', uri: '/code-churn-frequency'},
    {name: 'Commit activity trend', uri: '/commit-activity-trend'},
    {name: 'Velocity', uri: '/velocity'}
  ];

  const handleChangeRepoId = (repositoryId) => {
    setRepositoryId(repositoryId)
  }

  const mainLayOutContextValue = {
    repositoryId: repositoryId,
    handleChangeRepositoryId: (repositoryId) => {
      handleChangeRepoId(repositoryId)
    }
  }

  return (
    <div className={classes.root}>
      <MainLayoutContexProvider value={mainLayOutContextValue}>
        <Router>
          <CssBaseline />
          <Navbar subMenuItem={subMenuItem} userInfor={userInfor} handleLogout={handleLogout} />
          <Container>
            <Switch>
              <Route path="/" exact component={RepositoryList} />
              {subMenuItem.map((subMenuItem, index) => (
                <Route
                  key={subMenuItem.uri}
                  path={`/repository/:id${subMenuItem.uri}`}
                  component={subMenuItem.component}
                />
              ))}
            </Switch>
          </Container>
        </Router>
      </MainLayoutContexProvider>
    </div>
  )
}

MainLayout.propTypes = {
  handleLogout: PropTypes.func.isRequired,
}

export default MainLayout
