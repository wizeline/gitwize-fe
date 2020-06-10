import React from 'react'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { makeStyles } from '@material-ui/core/styles'

const useStyles  = makeStyles((theme) => ({
  addRepo: {
    color: '#919892;',
    width: '100%',
    backgroundColor: '#edfcef',
    border: '1px solid #d1ecd5',
    padding: '8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px'
  },
  removeRepo: {
    color: '#919892;',
    width: '100%',
    backgroundColor: '#f7eded',
    border: '1px solid #ecc4c4',
    padding: '8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px'
  },
  addIcon: {
    color: '#4ad962',
    fontSize: '33px'
  },
  removeIcon: {
    color: '#db2828',
    fontSize: '33px'
  },
  repoName: {
    fontWeight: 600
  }
}))

export default function MessageNotification(props) {
  const {repoName, removeRepo} = props
  const styles = useStyles()

  if(!removeRepo) {
    return (
      <div className={styles.addRepo} style={{display: `${repoName === '' ? "none" : "flex"}` }}>
        <CheckCircleIcon className={styles.addIcon}/>
        &nbsp;You've successfully added repo&nbsp;<p className={styles.repoName}>{repoName}</p>
      </div>
    )
  } else {
    return (
      <div className={styles.removeRepo} style={{display: `${repoName === '' ? "none" : "flex"}` }}>
        <DeleteForeverIcon className={styles.removeIcon}/>
        &nbsp;You've successfully removed repo&nbsp;<p className={styles.repoName}>{repoName}</p>
      </div>
    )
  }
}