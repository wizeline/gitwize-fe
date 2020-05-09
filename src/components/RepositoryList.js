import React, { useState } from 'react'
import clsx from 'clsx'
import { Button } from '@material-ui/core'
import GetStartedImg from '../assets/images/getstarted.png'
import styles from './RepositoryList.module.css'
import RepositoryCard from './RepositoryCard'

export default function RepositoryList() {
  const [isEmpty] = useState(false)
  return (
    <div className={clsx(styles.root, isEmpty ? styles.empty : styles.notEmpty)}>
      {isEmpty ? (
        <>
          <img alt="GetStarted" src={GetStartedImg} />
          <p className={styles.textMedium}>Get Started</p>
          <p className={styles.textSmallDisabled}>
            Welcome to Gitwize. To get you started, first add a new repository.
          </p>
          <div style={{ height: '100px' }} />
          <Button className={styles.button}>Add Repository</Button>
        </>
      ) : (
        <>
          <div className={styles.rowAlign}>
            <p className={styles.textMedium}>Active Repositories</p>
            <Button className={styles.button}>Add a repository</Button>
          </div>
          <p className={styles.textSmallDisabled}>Most recent</p>
          {[
            { name: 'repository 1', lastUpdated: '23/02/2020', type: 'GitHub' },
            { name: 'repository 2', lastUpdated: '21/02/2020', type: 'GitHub' }
          ].map(item => (
            <RepositoryCard repo={item} />
          ))}
        </>
      )}
    </div>
  )
}
