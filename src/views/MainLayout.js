import React, { useState, useEffect } from 'react'
import { useOktaAuth } from '@okta/okta-react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Switch, NavLink, Link } from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem'
import { ListItemText, Button } from '@material-ui/core'
import PermIdentityIcon from '@material-ui/icons/PermIdentityOutlined'
import DashboardIcon from '@material-ui/icons/DashboardOutlined'
import CallToActionIcon from '@material-ui/icons/CallToActionOutlined'
import Collapse from '@material-ui/core/Collapse';
import Container from '@material-ui/core/Container';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { ApiClient } from '../apis'

import RepositoryList from './RepositoryList'
import RepositoryStats from '../pages/RepositoryStats'
import PullRequestStats from '../pages/PullRequestStats'
import useToggle from '../hooks/useToggle'
import { MainLayoutContexProvider } from '../contexts/MainLayoutContext'

const drawerWidth = (256)
const apiClient = new ApiClient()

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  paper: {
    background: '#FFF',
    width: drawerWidth,
    overflow: 'hidden',
    boxShadow: '6px 0px 18px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  logoText: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontSize: '11px',
    lineHeight: '15px',
    /* identical to box height */
    textAlign: 'center',
    color: '#cccccc',
    flex:'none !important',
  },
  logoTextBold: {
    flex:'none !important',
    fontWeight: 'bold',
    color: '#b5b5b5'
  },
  button: {
    padding: 0,
    minWidth: 0,
  },
  chosenButton: {
    padding: 0,
    minWidth: 0,
    background: '#FDEFEF',
    borderRadius: '8px'
  },
  icon: {
    color: '#ec5d5c'
  },
  buttonText: {
    marginLeft: '2vh',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '21px',
    color: '#EC5D5C'
  },
  buttonSubMenutext: {
    marginLeft: '4.5vh',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '15px',
    lineHeight: '21px',
    color: '#202020'
  },
  iconRotate: {
    transform: 'rotate(90deg)',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: 'white',
  },
  textRoot: {
    flex: 'none'
  }
}))

function MainLayout(props) {
  const {handleLogout, userInfor} = props;
  const classes = useStyles()
  const [repositoryId, setRepositoryId] = useState()
  const [repositoryName, setRepositoryName] = useState()
  const [isDisplayDashBoard, setStateDashBoard] = useState(false)
  const [isSubMenuOpen, toggleSubMenu] = useToggle(false)
  const { authState } = useOktaAuth()
  useEffect(() => {
    if(repositoryId) {
      apiClient.setAccessToken(authState.accessToken)
      apiClient.stats.getRepoStats(repositoryId).then((data) => {
        setRepositoryName(data.name)
        setStateDashBoard(true)
      })
    }
  }, [authState.accessToken, repositoryId])
  let dashBoard

  const subMenuItem = [
    { name: 'Repository stats', uri: '/repository-stats', component: RepositoryStats },
    { name: 'Pull request stats', uri: '/pull-request-stats', component: PullRequestStats },
    { name: 'Contributor stats', uri: '/contributor-stats' },
    { name: 'Inactivity', uri: '/inactivity' },
    { name: 'Code churn/frequency', uri: '/code-churn-frequency' },
    { name: 'Commit activity trend', uri: '/commit-activity-trend' },
    { name: 'Velocity', uri: '/velocity' },
  ]

  const mainLayOutContextValue = {
    handleDisplaySubMenu: (isDisplayDashBoard) => {
      setStateDashBoard(isDisplayDashBoard)
    },
    handleChangeRepositoryId: (repositoryId) => {
      setRepositoryId(repositoryId)
    },
    handleChangeRepositoryName: (repositoryName) => {
      setRepositoryName(repositoryName)
    }
  }
  
  const handleBackToRepo = () => {
    if(isSubMenuOpen) {
      toggleSubMenu();
    }
    setStateDashBoard(false);
  }

  if(isDisplayDashBoard) {
    dashBoard = (
      <ListItem>
        <Button className={classes.button} onClick={() => toggleSubMenu()}>
          <DashboardIcon className={classes.icon} />
          <ListItemText classes={{primary: classes.buttonText}} primary={repositoryName}/>
          {isSubMenuOpen ? <ExpandLess /> : <ExpandMore />}
        </Button>
      </ListItem>
    )
  } else {
    dashBoard = (
      <ListItem>
        <Button className={classes.button}>
          <DashboardIcon className={classes.icon} />
          <ListItemText classes={{primary: classes.buttonText}} primary={'Active Repositories'}/>
        </Button>
      </ListItem>
    )
  }
  

  return (
    <div className={classes.root}>
      <MainLayoutContexProvider value={mainLayOutContextValue}>
        <Router>
          <CssBaseline />
          <Drawer variant="permanent" className={classes.drawer} PaperProps={{ className: classes.paper }}>
            <List>
              <Link to="/" style={{ width: '100%' }}>
                <Button onClick={handleBackToRepo}>
                  <ListItem>
                    <ListItemText classes={{ primary: clsx(classes.logoText, classes.logoTextBold), root: classes.textRoot }}>Git</ListItemText>
                    <ListItemText classes={{ primary: classes.logoText, root: classes.textRoot }}>Wize</ListItemText>
                  </ListItem>
                </Button>
              </Link>
              <ListItem>
                <Button className={classes.button}>
                  <PermIdentityIcon className={classes.icon} />
                  <ListItemText classes={{primary: classes.buttonText}} primary={userInfor.name}/>
                </Button>
              </ListItem>
              <Divider />
              {dashBoard}
            </List>
            <Collapse in={isSubMenuOpen}>
              <List>
                {subMenuItem.map((subMenuItem, index) => (
                  <ListItem button key={subMenuItem.name}>
                  <NavLink activeClassName={classes.chosenButton} key={index} to={`/repository/${repositoryId}${subMenuItem.uri}`} style={{ width: '100%' }}>
                    <ListItemText classes={{primary: classes.buttonSubMenutext}}  primary={subMenuItem.name}/>
                  </NavLink>
                </ListItem>
                ))}
              </List>
            </Collapse>
            <List  style={{marginTop: 'auto'}}>
              <ListItem>
                <Button className={classes.button} onClick={handleLogout}>
                  <CallToActionIcon className={clsx(classes.icon, classes.iconRotate)} />
                </Button>
              </ListItem>
            </List>
            
          </Drawer>

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
