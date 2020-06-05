import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  header: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '28px',
    lineHeight: '42px',
    letterSpacing: '0.01em',
    color: '#192a3e',
  },
  button: {
    backgroundColor: '#000000 !important',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.24)',
    borderRadius: '4px',

    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '13px',
    lineHeight: '19px',
    textAlign: 'center',
    letterSpacing: '0.01em',
    color: '#ffffff !important',
    margin: '30px !important',
  },
}))

function ConfirmationDialog(props) {
  const { isOpen, alertHeader, alertText, handleCancel, handleOK } = props
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <Dialog open={isOpen} onClose={handleCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className={styles.header}>
          {alertHeader}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {alertText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className={styles.button} onClick={() => handleCancel()} color="primary">
            Cancel
          </Button>
          <Button className={styles.button} onClick={() => handleOK()} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ConfirmationDialog
