import React, { useState, useEffect, useContext, useRef } from 'react'
import clsx from 'clsx'
import { useOktaAuth } from '@okta/okta-react'
import { Button } from '@material-ui/core'
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import AppsRoundedIcon from '@material-ui/icons/AppsRounded';
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import { ApiClient } from '../apis'
import GetStartedImg from '../assets/images/getstarted.png'
import RepositoryCard from '../components/RepositoryCard'
import AddRepositoryDialog from './AddRepositoryDialog'
import MessageNotification from '../components/MesageNotification'
import CircularProgress from '@material-ui/core/CircularProgress';
import MainLayoutContex from '../contexts/MainLayoutContext';

const apiClient = new ApiClient()
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    paddingTop: '10vh',
    flexDirection: 'column',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'space-around',

    '>.textMedium': {
      marginTop: '-100px',
    },
  },
  notEmpty: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',

    '>.textSmallDisabled': {
      display: 'flex',
      alignItems: 'flex-start',
    },
  },
  rowAlign: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textMedium: {
    margin: 0,
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '35px',
    lineHeight: '52px',
    textAlign: 'center',
    letterSpacing: '0.01em',
    color: '#192a3e',
  },
  textSmallDisabled: {
    width: '258px',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '19px',
    textAlign: 'left',
    color: '#c4c4c4',
  },
  button: {
    backgroundColor: '#FAFAFA !important',
    borderRadius: '8px',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '15px',
    lineHeight: '19px',
    textAlign: 'center',
    letterSpacing: '0.01em',
    color: '#3E3E3E!important',
    textTransform: 'none',
    border: '1px solid #3E3E3E',
    padding: '0 !important',
    width: '12vw'
  },
  gridRoot: {
    width: '100%'
  },
  gridButtonLayout: {
    display: 'inherit',
    justifyContent: 'flex-end',
    marginTop: '1vh',
  },
  buttonLayoutChosen: {
    color: '#DADADA'
  },
  loadingImage: {
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

export default function RepositoryList() {
  const { authState } = useOktaAuth()
  const mainLayoutContext = useRef(useContext(MainLayoutContex))
  const [isDisplayColumnGrid, setColumnLayout] = useState(false);
  const [repoList, setRepoList] = useState()
  const [isOpen, setOpen] = useState(false)
  const [repoName , setRepoName] = useState('')
  const [removeExistingRepo, setRemovexistingRepo] = useState(true)
  const styles = useStyles()

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
      apiClient.repos.listRepo().then((repo) => {
        setRepoList(repo)
        mainLayoutContext.current.handleChangeRepoList(repo)
      })
  }, [authState.accessToken])

  const handleAddDialog = () => {
    setOpen(true)
  }

  const handleCloseAddDialog = () => {
    setOpen(false)
  }

  const removeRepo = (item) => {
    const removed = repoList.filter(x => x.id !== item.id)
    
    mainLayoutContext.current.handleChangeRepoList(removed)
    setRepoName(item.name)
    setRemovexistingRepo(true)
    setRepoList(removed)
  }

  const closeMessageNotification = () => {
    setRepoName('')
  }

  const handleDeletionCancel = () => {}

  const handleAddRepo = async (repoDetail = {}) => {
    apiClient.setAccessToken(authState.accessToken)

    const response = await apiClient.repos.createRepo(repoDetail)
    setRepoName(response.name)
    setRemovexistingRepo(false)
    const newRepo = {
      ...repoDetail,
      id: response.id,
      name: response.name,
      last_updated: response.last_updated,
      type: 'GitHub',
    }

    mainLayoutContext.current.handleChangeRepoList([...repoList, newRepo])
    setRepoList([...repoList, newRepo])
    setOpen(false)
  }

  const handleChangeLayout = (isDisplayColumnGrid) => {
    setColumnLayout(isDisplayColumnGrid)
  }
  
  let repoListComponent;
  
  if(repoList !== undefined) {
    repoListComponent = repoList.length === 0 ? (
      <>
        <img alt="GetStarted" src={GetStartedImg} />
        <p className={styles.textMedium}>Get Started</p>
        <p className={styles.textSmallDisabled}>
          Welcome to Gitwize. To get you started, first add a new repository.
        </p>
        <div style={{ height: '100px' }} />
        <Button onClick={handleAddDialog} className={styles.button}>
          Add repository
        </Button>
      </>
    ) : (
      <>
        <div className={styles.rowAlign}>
          <p className={styles.textMedium}>Active Repositories</p>
          <Button onClick={handleAddDialog} className={styles.button}>
            Add repository
          </Button>
        </div>
        <Grid container className={styles.gridRoot}>
          <Grid item xs={12} className={styles.gridButtonLayout}>
            <Button className={clsx(isDisplayColumnGrid && styles.buttonLayoutChosen)} onClick={() => handleChangeLayout(false)}>
              <MenuRoundedIcon />
            </Button>
            <Button className={clsx(!isDisplayColumnGrid && styles.buttonLayoutChosen)} onClick={() => handleChangeLayout(true)}>
              <AppsRoundedIcon />
            </Button>
          </Grid>
        </Grid>
        <Grid container className={styles.gridRoot}>
          <Grid item xs={12}>
            <p className={styles.textSmallDisabled} style={{marginBottom: 55}}>Most recent</p>
          </Grid>
        </Grid>
        <Grid container className={styles.gridRoot} spacing={isDisplayColumnGrid ? 4 : 0}>
            <MessageNotification repoName={repoName} isRemovingMessage={removeExistingRepo} handleMessage={closeMessageNotification}/>
            {repoList
            .slice(0)
            .reverse()
            .map((item, index) => (
              <Grid item xs={isDisplayColumnGrid ? 4 : 12}>
                <div key={item.id} style={{width: '100%'}}>
                  <RepositoryCard key={item.id} repo={item} handleDeletionOK={(item) => removeRepo(item)} handleDeletionCancel={() => handleDeletionCancel()}/>
                </div>
              </Grid>
            ))}
        </Grid>
      </>
    )
  } else {
    repoListComponent = <CircularProgress/>
  }

  return (
    <div className={clsx(styles.root, (repoList && repoList.length) === 0 ? styles.empty : styles.notEmpty, (!repoList) && styles.loadingImage)}>
      {repoListComponent}
      <AddRepositoryDialog
        isOpen={isOpen}
        handleClose={() => handleCloseAddDialog()}
        handleAdd={(item) => handleAddRepo(item)}
      />
    </div>
  )
}
