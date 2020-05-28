import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import ListItem from '@material-ui/core/ListItem'
import { ListItemText, Button } from '@material-ui/core'
import PermIdentityIcon from '@material-ui/icons/PermIdentityOutlined'
import DashboardIcon from '@material-ui/icons/DashboardOutlined'
import CallToActionIcon from '@material-ui/icons/CallToActionOutlined'
import ArrowBackIcon from '@material-ui/icons/ArrowBackOutlined';
import Container from '@material-ui/core/Container'

import RepositoryList from './RepositoryList'
import RepositoryStats from '../pages/RepositoryStats'
import PullRequestStats from '../pages/PullRequestStats'
import useToggle from '../hooks/useToggle';
import {MainLayoutContexProvider} from '../contexts/MainLayoutContext'

const drawerWidth = 68

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
    background: '#000',
    width: drawerWidth,
    overflow: 'hidden',
    boxShadow: '6px 0px 18px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  subMenu: {
    width: drawerWidth,
  },
  subMenu_paper: {
    left: drawerWidth,
    overflow: 'hidden',
    boxShadow: '6px 0px 18px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logoText: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontSize: '11px',
    lineHeight: '15px',
    /* identical to box height */
    textAlign: 'center',
    color: '#F2F2F2',
  },
  logoTextBold: {
    fontWeight: 'bold',
  },
  button: {
    padding: 0,
    minWidth: 0,
  },
  icon: {
    color: '#F2F2F2',
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
}))

function MainLayout({ handleLogout }) {
  const classes = useStyles();
  const [isDisplayDashBoard, setStateDashBoard] = useState(false);
  const [repositoryId, setRepositoryId] = useState();
  const sideMenuPosition = 'left';
  const [isSubMenuOpen, toggleSubMenu] = useToggle(false);
  let dashBoard, arrowBack;

  const subMenuItem = [
    {name: 'Repository stats', uri: '/repository-stats', component: RepositoryStats},
    {name: 'Pull request stats', uri: '/pull-request-stats', component: PullRequestStats}, 
    {name: 'Contributor stats', uri: '/contributor-stats'},
    {name: 'Inactivity', uri: '/inactivity'},
    {name: 'Code churn/frequency', uri: '/code-churn-frequency'},
    {name: 'Commit activity trend', uri: '/commit-activity-trend'},
    {name: 'Velocity', uri: '/velocity'}
  ];

  const mainLayOutContextValue = {
    handleDisplaySubMenu: (isDisplayDashBoard) => {setStateDashBoard(isDisplayDashBoard)},
    handleChangeRepositoryId: (repositoryId) => {setRepositoryId(repositoryId)}
  }

  if(isDisplayDashBoard) {
    dashBoard =  (<ListItem>
                    <Button className={classes.button} onClick = {() => toggleSubMenu()}>
                      <DashboardIcon className={classes.icon} />
                    </Button>
                  </ListItem>);
    arrowBack = (<Link to="/" style={{ width: '100%' }}>
                  <ListItem>
                    <Button className={classes.button} onClick = {() => {
                      setStateDashBoard(false);
                      if(isSubMenuOpen) {
                        toggleSubMenu()
                      }}}>
                      <ArrowBackIcon className={classes.icon} />
                    </Button>
                  </ListItem>
                </Link>);
  }

  return (
    <div className={classes.root}>
      <MainLayoutContexProvider value ={mainLayOutContextValue}>
        <Router>
          <CssBaseline />
          <Drawer variant="permanent" className={classes.drawer} PaperProps={{ className: classes.paper }}>
            <List>
              <ListItem>
                <ListItemText classes={{ primary: clsx(classes.logoText, classes.logoTextBold) }}>Git</ListItemText>
                <ListItemText classes={{ primary: classes.logoText }}>Wize</ListItemText>
              </ListItem>
              <ListItem>
                <Button className={classes.button}>
                  <PermIdentityIcon className={classes.icon} />
                </Button>
              </ListItem>
              {dashBoard}
              {arrowBack}
            </List>
            <List>
              <ListItem>
                <Button className={classes.button} onClick={handleLogout}>
                  <CallToActionIcon className={clsx(classes.icon, classes.iconRotate)} />
                </Button>
              </ListItem>
            </List>
          </Drawer>
          <Drawer variant="persistent" className={classes.subMenu} PaperProps={{ className: classes.subMenu_paper }}
            anchor={sideMenuPosition} open={isSubMenuOpen}>
            <List>
              {subMenuItem.map((subMenuItem, index) => (
                <Link key={index} to={'/repository/'+repositoryId+subMenuItem.uri} style={{ width: '100%' }}>
                  <ListItem button key={subMenuItem.name} onClick={() => toggleSubMenu()}>
                    <ListItemText primary={subMenuItem.name} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </Drawer>

          <Container>
              <Switch>
                <Route path="/" exact component={RepositoryList} />
                {subMenuItem.map((subMenuItem, index) =>(
                  <Route key={index} path={'/repository/:id' + subMenuItem.uri} component={subMenuItem.component} />
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
