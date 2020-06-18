import { useOktaAuth } from '@okta/okta-react'
import React, {useState, useContext, useEffect} from 'react'
import { ApiClient } from '../apis'
import useToggle from '../hooks/useToggle';
import MainLayoutContex from '../contexts/MainLayoutContext'
import PageContext from '../contexts/PageContext'

import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider';
import CallToActionIcon from '@material-ui/icons/CallToActionOutlined'
import Collapse from '@material-ui/core/Collapse';
import ListItem from '@material-ui/core/ListItem'
import { ListItemText, Button } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/DashboardRounded'
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {NavLink, Link} from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import clsx from 'clsx'


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
    fontWeight: 'bold',
  },
  wrapperButton: {
    background: '#FDEFEF',
    borderRadius: '8px',
    width: '100%',
    marginRight: '1vh',
    marginTop: '5px'
  },
  icon: {
    color: '#ec5d5c'
  },
  buttonText: {
    marginLeft: '1vh',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '21px',
    color: '#EC5D5C',
  },
  userText: {
    marginLeft: '1vh',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '21px',
    color: 'rgba(0, 0, 0, 0.87)',
  },
  buttonSubMenutext: {
    marginLeft: '2.5vh',
    fontStyle: 'normal',
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
  },
  avatar: {
    marginRight: 10,
    width: '30px',
    height: '30px'
  },
  textTruncated: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 600
  }
}))

const today = new Date()
const last7Days = new Date(today.getTime() - (6 * 24 * 60 * 60 * 1000))

function Navbar (props) {
  const mainLayout = useContext(MainLayoutContex)
  const [{ dateRange }, dispatch] = useContext(PageContext)
  const repoId = mainLayout.repositoryId
  const {handleLogout, userInfor, subMenuItem} = props;
  const classes = useStyles()
  const [repositoryName, setRepositoryName] = useState()
  const [isDisplayDashBoard, setStateDashBoard] = useState(false)
  const [isSubMenuOpen, toggleSubMenu] = useToggle(true)
  const { authState } = useOktaAuth()
  useEffect(() => {
    if(repoId) {
      apiClient.setAccessToken(authState.accessToken)
      apiClient.stats.getRepoStats(repoId, dateRange).then((data) => {
        setRepositoryName(data.name)
        setStateDashBoard(true)
      })
    }
  }, [authState.accessToken, repoId, dateRange])
  let dashBoard
  
  const handleBackToRepo = () => {
    setStateDashBoard(false);
    mainLayout.handleChangeRepositoryId(undefined);
    if(!isSubMenuOpen) {
      toggleSubMenu()
    }
  }

  const resetDateRange = () => {
    dispatch({
      type: 'changeDate',
      newDate: { 
        date_from: last7Days,
        date_to: today
      }
    })
  }

  const handleLink = () => {
    resetDateRange()
  }

  if(isDisplayDashBoard) {
    dashBoard = (
      <ListItem className={classes.button}>
        <Tooltip title={repositoryName} placement='right-end' arrow enterDelay={3000} enterNextDelay={3000}>
          <Button className={clsx(classes.buttonText, classes.wrapperButton)} onClick={() => toggleSubMenu()}>
              <DashboardIcon className={classes.icon} />
              <ListItemText classes={{primary: classes.textTruncated}} primary={repositoryName}/>
              {isSubMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </Button>
        </Tooltip>
      </ListItem>
    )
  } else {
    dashBoard = (
      <ListItem className={classes.button}>
        <Button className={clsx(classes.buttonText, classes.wrapperButton)}>
          <DashboardIcon className={classes.icon} />
          <ListItemText classes={{primary: classes.textTruncated}} primary={'Active Repositories'}/>
        </Button>
      </ListItem>
    )
  }

  return (
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
        <ListItem style={{marginBottom: 20}}>
          <Button className={classes.button}>
            <Avatar alt="Logo" className={classes.avatar} src='/images/wizeline_logo.png' />
            <ListItemText classes={{primary: classes.userText}} primary={userInfor.name}/>
          </Button>
        </ListItem>
        <Divider />
        {dashBoard}
      </List>
      <Collapse in={isSubMenuOpen && (repoId !== undefined)}>
        <List>
          {subMenuItem.map((subMenuItem, index) => (
            <ListItem button key={subMenuItem.name}>
            <NavLink className={classes.buttonSubMenutext} activeClassName={classes.chosenButton} key={index} to={`/repository/${repoId}${subMenuItem.uri}`} style={{ width: '100%' }} onClick={handleLink}>
            {subMenuItem.name}
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
  )
}

export default Navbar
