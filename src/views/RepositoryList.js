import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { useOktaAuth } from '@okta/okta-react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { ApiClient } from '../apis'
import GetStartedImg from '../assets/images/getstarted.png'
import RepositoryCard from '../components/RepositoryCard'
import AddRepositoryDialog from './AddRepositoryDialog'
import MessageNotification from '../components/MesageNotification'

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
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '28px',
    lineHeight: '42px',
    textAlign: 'center',
    letterSpacing: '0.01em',
    color: '#192a3e',
  },
  textSmallDisabled: {
    width: '258px',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '19px',
    color: '#c4c4c4',
  },
  button: {
    backgroundColor: '#000000 !important',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.24)',
    borderRadius: '4px',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '13px',
    lineHeight: '19px',
    textAlign: 'center',
    letterSpacing: '0.01em',
    color: '#ffffff !important',
  },
}))

export default function RepositoryList() {
  const { authState } = useOktaAuth()
  const [repoList, setRepoList] = useState([])
  const [isOpen, setOpen] = useState(false)
  const [repoName , setRepoName] = useState('')
  const [removeExistingRepo, setRemovexistingRepo] = useState(true)
  const styles = useStyles()

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    apiClient.repos.listRepo().then((repo) => setRepoList(repo))
  }, [authState.accessToken])

  const handleAddDialog = () => {
    setOpen(true)
  }

  const handleCloseAddDialog = () => {
    setOpen(false)
  }

  const removeRepo = (item) => {
    const removed = repoList.filter(x => x.id !== item.id)

    setRepoList(removed)
    setRepoName(item.name)
    setRemovexistingRepo(true)
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

    setRepoList([...repoList, newRepo])
    setOpen(false)
  }

  return (
    <div className={clsx(styles.root, repoList.length === 0 ? styles.empty : styles.notEmpty)}>
      {repoList.length === 0 ? (
        <>
          <img alt="GetStarted" src={GetStartedImg} />
          <p className={styles.textMedium}>Get Started</p>
          <p className={styles.textSmallDisabled}>
            Welcome to Gitwize. To get you started, first add a new repository.
          </p>
          <div style={{ height: '100px' }} />
          <Button onClick={handleAddDialog} className={styles.button}>
            Add Repository
          </Button>
        </>
      ) : (
        <>
          <div className={styles.rowAlign}>
            <p className={styles.textMedium}>Active Repositories</p>
            <Button onClick={handleAddDialog} className={styles.button}>
              Add a repository
            </Button>
          </div>
          <p className={styles.textSmallDisabled}>Most recent</p>
          <MessageNotification repoName={repoName} removeRepo={removeExistingRepo}/>
          {repoList
            .slice(0)
            .reverse()
            .map((item, index) => (
              <div key={item.id} style={{width: '100%'}}>
                <RepositoryCard key={item.id} repo={item} handleDeletionOK={(item) => removeRepo(item)} handleDeletionCancel={() => handleDeletionCancel()}/>
              </div>
            ))}
        </>
      )}
      <AddRepositoryDialog
        isOpen={isOpen}
        handleClose={() => handleCloseAddDialog()}
        handleAdd={(item) => handleAddRepo(item)}
      />
    </div>
  )
}
