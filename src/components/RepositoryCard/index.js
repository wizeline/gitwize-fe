import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import GitHubIcon from '@material-ui/icons/GitHub'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { makeStyles } from '@material-ui/core/styles'
import { useOktaAuth } from '@okta/okta-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { DateTime } from 'luxon'
import { ApiClient } from '../../apis'
import ConfirmationDialog from '../Confirmation/ConfirmationDialog'

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
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between'
  },
  deleteBtn: {
    // alignSelf: 'flex-end'
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
    display: 'flex',
    flexDirection: 'row',
  },
  typeText: {
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
  const statsPage = "repository-stats"
  const { repo, handleDeletionOK, handleDeletionCancel } = props
  const styles = useStyles()
  const { authState } = useOktaAuth()
  const [deletionConfirmOpen, setDeletionConfirmOpen] = useState(false)
  const apiClient = new ApiClient()

  const alertHeader = "Repository Deletion"
  const alertText = "Are you sure that you want to delete this repository?"


  const handleDeletionConfirmationOK = async (repoDetail = {}) => {
    apiClient.setAccessToken(authState.accessToken)
    await apiClient.repos.deleteRepo(repo.id)
    // TODO error handling
    handleDeletionOK(repo)
    setDeletionConfirmOpen(false)
  }

  const handleDeletionConfirmationCancel = () => {
    setDeletionConfirmOpen(false)
    handleDeletionCancel()
  }

  const showDeletionConfirmationDialog = () => {
    setDeletionConfirmOpen(true)
  }

  return (
    <Card className={styles.root}>
      <CardContent className={styles.clickable}>
        <Link key ={repo.id} to={`/repository/${repo.id}/${statsPage}/`} style={{ width: '100%' }}>
          <p className={styles.repoName}>{repo.name}</p>
        </Link>
        <div className={styles.detail}>
          <p className={clsx(styles.header, styles.value)}>
            Last Updated:
            {DateTime.fromISO(repo.last_updated).toLocaleString()}
          </p>
        </div>
        <div className={styles.footer}>
          <div className={styles.type}>
            <GitHubIcon />
            <p className={styles.typeText}>GitHub</p>
          </div>
          <div className={styles.deleteBtn} onClick={() => showDeletionConfirmationDialog()}>
              <DeleteOutlineIcon />
          </div>
        </div>
      </CardContent>
      <ConfirmationDialog
      isOpen={deletionConfirmOpen}
      handleCancel={() => handleDeletionConfirmationCancel()}
      handleOK={() => handleDeletionConfirmationOK()}
      alertHeader={alertHeader} alertText={alertText}/>
    </Card>
  )
}

RepositoryCard.defaultProps = {
  repo: {},
}

export default RepositoryCard
