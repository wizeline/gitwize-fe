import React from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import GitHubIcon from '@material-ui/icons/GitHub'
import { Link } from 'react-router-dom'

import styles from './RepositoryCard.module.css'

function RepositoryCard(props) {
  const { repo } = props
  console.log(repo)
  return (
    <Link to="/repository-stats" style={{ width: '100%' }}>
      <Card className={styles.root}>
        <CardContent className={styles.clickable}>
          <p className={styles.repoName}>{repo.url}</p>
          <div className={styles.detail}>
            <p className={styles.header}>Last Updated: 05/26/2020</p>
            <p className={styles.value}>{repo.lastUpdated}</p>
          </div>
          <div className={styles.detailType}>
            <GitHubIcon />
            <p className={styles.type}>GitHub</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

RepositoryCard.propTypes = {
  repo: PropTypes.shape({
    name: PropTypes.string,
    lastUpdated: PropTypes.string,
    type: PropTypes.string,
  }),
}

RepositoryCard.defaultProps = {
  repo: {},
}

export default RepositoryCard
