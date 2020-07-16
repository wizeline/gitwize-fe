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
import ConfirmationDialog from '../ConfirmationDialog'

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
    borderRadius: '4px',
    width: '100%',
    margin: '5px 0 5px 0',
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
    alignItems: 'center'
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
  icon: {
    fontSize: '30px'
  }
}))

const apiClient = new ApiClient()
const pendingMessage = 'Repository added. It may take from few minutes to few hours for the data to reflect.'
function RepositoryCard(props) {
  const statsPage = "code-change-velocity"
  const { repo, handleDeletionOK, handleDeletionCancel } = props
  const styles = useStyles()
  const { authState } = useOktaAuth()
  const [deletionConfirmOpen, setDeletionConfirmOpen] = useState(false)

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

  const status = repo.status

  let cardContent
  if(status === 'AVAILABLE') {
    cardContent = (
      <>
        <Link key ={repo.id} to={`/repository/${repo.id}/${statsPage}/`} className={styles.clickable}>
          <p style={{marginBottom: 19}} className={styles.repoName}>{repo.name}</p>
        </Link>
        <div className={styles.detail}>
          <p className={clsx(styles.header, styles.value)}>
            Last Updated: &nbsp;
          </p>
          <p style={{color: 'black'}}>
            {DateTime.fromISO(repo.last_updated).toLocaleString()}
          </p>
        </div>
      </>
    )
  } else {
    cardContent = (
      <>
        <p style={{marginBottom: 12}} className={styles.repoName}>{repo.name}</p>
        <div className={styles.repoName} style={{color: '#EFCA08'}}>
          Pending
        </div>
        <div className={styles.detail} >
          {pendingMessage}
        </div>
      </>
    )
  }

  return (
    <Card className={styles.root}>
      <CardContent>
        {cardContent}
        <div className={styles.footer} style={{opacity: status === 'AVAILABLE' ? 1 : 0.3 }}>
          <div className={styles.type}>
            <GitHubIcon className={styles.icon}/>
            <p className={styles.typeText}>GitHub</p>
          </div>
          <div className={styles.deleteBtn} onClick={() => showDeletionConfirmationDialog()}>
              <DeleteOutlineIcon className={styles.clickable}/>
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
