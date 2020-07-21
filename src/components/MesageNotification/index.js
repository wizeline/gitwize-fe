import React from 'react'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'; 

const useStyles  = makeStyles((theme) => ({
  root: {
    color: '#919892;',
    width: '100%',
    backgroundColor: '#edfcef',
    border: '1px solid #d1ecd5',
    padding: '8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    height: '50px'
  },
  closeIcon: {
    marginLeft: 'auto',
    cursor: 'pointer'
  },
  addIcon: {
    color: '#4ad962',
    fontSize: '33px'
  }
}))

export default function MessageNotification(props) {
  const {repoName, isRemovingMessage, handleMessage} = props
  const styles = useStyles()

  let messageContent;
  if(!isRemovingMessage) {
    messageContent = (
      <>
        &nbsp;Repository &nbsp;<strong>{repoName}</strong>&nbsp;added successfully
      </>
      )
  } else {
    messageContent = (
      <>
        &nbsp;You've successfully removed repo&nbsp;<strong>{repoName}</strong>
      </>
    )
  }

  return (
    <div className={styles.root} style={{display: `${repoName === '' ? "none" : "flex"}` }}>
      <CheckCircleIcon className={styles.addIcon}/>
      {messageContent}
      <CloseIcon className={styles.closeIcon} onClick={handleMessage} />
    </div>
  )

}