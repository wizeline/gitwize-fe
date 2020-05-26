import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import styles from './AddRepositoryDialog.module.css'

function AddRepositoryDialog(props) {
  const { isOpen, handleClose, handleAdd } = props
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState('')

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
