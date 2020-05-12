import React, { useState } from 'react'
import clsx from 'clsx'
import { Button } from '@material-ui/core'
import GetStartedImg from '../assets/images/getstarted.png'
import styles from './RepositoryList.module.css'
import RepositoryCard from './RepositoryCard'
import AddRepositoryDialog from './AddRepositoryDialog'

export default function RepositoryList() {
  const [repoList, setRepoList] = useState([])
  const [isOpen, setOpen] = useState(false)

  const handleAddDialog = () => {
    setOpen(true)
  }

  const handleCloseAddDialog = () => {
    setOpen(false)
  }

  const handleAddRepo = (newRepo = {}) => {
    repoList.push({
      name: newRepo.url,
      lastUpdated: new Date().toLocaleDateString(),
      type: 'GitHub'
    })
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
          {repoList.map(item => (
            <RepositoryCard key={item.name} repo={item} />
          ))}
        </>
      )}
      <AddRepositoryDialog
        isOpen={isOpen}
        handleClose={() => handleCloseAddDialog()}
        handleAdd={item => handleAddRepo(item)}
      />
    </div>
  )
}
