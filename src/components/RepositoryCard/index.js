import React from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import GitHubIcon from '@material-ui/icons/GitHub'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { DateTime } from 'luxon'

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
    borderRadius: '4px',
    width: '100%',
    margin: '5px 0 5px 0',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
  },
  repoName: {
    fontWeight: 500,
    fontSize: '15px',
    lineHeight: '22px',
    /* identical to box height */
    letterSpacing: '0.01em',

    /* table_black */
    color: '#323c47',
  },
  detail: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '27px',
  },
  detailType: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    opacity: 0.5,
  },
  value: {
    fontWeight: 'normal',
    fontSize: '13px',
    lineHeight: '19px',
    letterSpacing: '0.01em',
    color: '#4c5862',
  },
  type: {
    fontWeight: 'normal',
    fontSize: '13px',
    lineHeight: '19px',
    letterSpacing: '0.01em',
    color: '#707683',
    marginLeft: '5px',
  },
  clickable: {
    cursor: 'pointer',
  },
}))

function RepositoryCard(props) {
  const { repo } = props
  const styles = useStyles()

  return (
    <Card className={styles.root}>
      <CardContent className={styles.clickable}>
        <p className={styles.repoName}>{repo.name}</p>
        <div className={styles.detail}>
          <p className={clsx(styles.header, styles.value)}>
            Last Updated:
            {DateTime.fromISO(repo.last_updated).toLocaleString()}
          </p>
        </div>
        <div className={styles.detailType}>
          <GitHubIcon />
          <p className={styles.type}>GitHub</p>
        </div>
      </CardContent>
    </Card>
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
