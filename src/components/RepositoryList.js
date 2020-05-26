import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { useOktaAuth } from '@okta/okta-react'
import { Button } from '@material-ui/core'

import { ApiClient } from '../apis'
import GetStartedImg from '../assets/images/getstarted.png'

import styles from './RepositoryList.module.css'
import RepositoryCard from './RepositoryCard'
import AddRepositoryDialog from './AddRepositoryDialog'

export default function RepositoryList() {
  const { authState } = useOktaAuth()
  const [repoList, setRepoList] = useState([])
  const [isOpen, setOpen] = useState(false)
  const apiClient = new ApiClient()

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    apiClient.repos.listRepo().then(repoList => setRepoList(repoList))
  }, [apiClient, authState])

  const handleAddDialog = () => {
    setOpen(true)
  }

  const handleCloseAddDialog = () => {
    setOpen(false)
  }

  const handleAddRepo = async (repoDetail = {}) => {
    apiClient.setAccessToken(authState.accessToken)
    
    const response = await apiClient.repos.createRepo(repoDetail)
    // TODO: those data should be returned by the API
    const newRepo = {
      ...repoDetail,
      id: response.id,
      name: repoDetail.url,
      lastUpdated: new Date().toLocaleDateString(),
      type: 'GitHub',
    }
    console.log('newRepo', newRepo)

    repoList.push(newRepo)
    setRepoList(repoList)
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
          {repoList.map((item) => (
            <RepositoryCard key={item.name} repo={item} />
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
