import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
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

function AddRepositoryDialog(props) {
  const { isOpen, handleClose, handleAdd } = props
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState('')
  const styles = useStyles()

  const reset = () => {
    setUserName('')
    setPassword('')
    setUrl('')
  }

  const handleSubmit = () => {
    // get data
    const data = { userName, password, url }
    reset()
    handleAdd(data)
  }

  return (
    <div className={styles.root}>
      <Dialog open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className={styles.header}>
          Add Repository
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="userName"
            label="User Name"
            type="text"
            fullWidth
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="projectUrl"
            label="Project repo URL"
            type="text"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button className={styles.button} onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button className={styles.button} onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

AddRepositoryDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
}

export default AddRepositoryDialog
