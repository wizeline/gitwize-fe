import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import GitHubIcon from '@material-ui/icons/GitHub'
import styles from './RepositoryCard.module.css'

export default function RepositoryCard() {
  return (
    <Card className={styles.root}>
      <CardContent>
        <p className={styles.repoName}>Repo Name</p>
        <div className={styles.detail}>
          <p className={styles.header}>Last Updated:</p>
          <p className={styles.value}>Last Update value</p>
        </div>
        <div className={styles.detailType}>
          <GitHubIcon />
          <p className={styles.type}>GitHub</p>
        </div>
      </CardContent>
    </Card>
  )
}
