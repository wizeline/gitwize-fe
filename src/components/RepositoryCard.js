import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import GitHubIcon from '@material-ui/icons/GitHub'
import styles from './RepositoryCard.module.css'

export default function RepositoryCard(props) {
    const {repo} = props
  return (
    <Card className={styles.root}>
      <CardContent>
        <p className={styles.repoName}>{repo.name}</p>
        <div className={styles.detail}>
          <p className={styles.header}>Last Updated:</p>
          <p className={styles.value}>{repo.lastUpdated}</p>
        </div>
        <div className={styles.detailType}>
          <GitHubIcon />
          <p className={styles.type}>{repo.type}</p>
        </div>
      </CardContent>
    </Card>
  )
}
