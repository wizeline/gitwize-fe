import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import clsx from 'clsx'
import InputAdornment from '@material-ui/core/InputAdornment'

import { getRepositoryNameFromGitHubUrl } from '../utils/apiUtils'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '50px'
  },
  header: {
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '37px',
    letterSpacing: '0.01em',
    color: '#192a3e',
    paddingTop: '60px',
    '& [class*="MuiTypography"]': {
      fontSize: '25px'
    }
  },
  content: {
    paddingBottom: '60px',
    '& [class*="MuiFormLabel-asterisk"]': {
      color: 'red'
    }
  },
  message: {
    paddingBottom: '10px',
    paddingLeft: '24px',
    paddingTop: '5px',
    color: '#6A707E',
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 'normal'
  },
  button: {
    borderRadius: '8px',

    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '13px',
    lineHeight: '19px',
    textAlign: 'center',
    letterSpacing: '0.01em',
    width: '100%',
    marginBottom:'26px',
    padding: '7px 0'
  },
  add: {
    background: '#EC5D5C',
    color: '#FFFFFF'
  },
  cancel: {
    color: '#121212',
    border: '1px solid #C4C4C4'
  },
  dialogAction: {
    padding: '0 24px'
  },
  tooltip: {
    fontSize: 9,
    padding: '35px 40px 40px 26px',
    marginRight: '10vw',
    borderRadius: 8,
    minHeight: 100,
    whiteSpace: 'pre-line'
  }
}))

// https://wizeline.atlassian.net/wiki/spaces/GWZ/pages/1368326818/Error+Handling
const REPOSITORY_ERROR_MAP = {
  "common.badJsonFormat": "Repo URL not found",
  "common.unauthorized": "Unauthorized",
  "repository.existed": "The repository already exists in the list",
  "repository.notFound": "Repository not found",
  "repository.badCredentials": "Incorrect credentials entered",
  "repository.invalidURL": "Invalid repo URL"
}

const toolTipMessage = 'To get the access token, please follow the guidelines on this page https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line'
function AddRepositoryDialog(props) {
  const { isOpen, handleClose, handleAdd, addingRepoError } = props
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
    const name = getRepositoryNameFromGitHubUrl(url)
    handleAdd({ ...data, name })
  }

  const handleCancel = () => {
    handleClose()
  }

  useEffect(() => {
    reset()
  }, [isOpen])


  let message
  if(addingRepoError) {
    message = <div className={styles.message} style={{ color: 'red' }}>
      {REPOSITORY_ERROR_MAP[addingRepoError.errorKey]}
    </div>
  } else {
    message = <div className={styles.message}>
      Please enter your GitHub credentials
    </div>
  }

  const toolTip = (
    <Tooltip title={toolTipMessage} placement='bottom-start' enterDelay={500} enterNextDelay={500} classes={{tooltip: styles.tooltip}}>
      <InfoOutlinedIcon/>        
    </Tooltip>
  )

  return (
      <Dialog open={isOpen} aria-labelledby="form-dialog-title" className={styles.root}>
        <Container>
        <DialogTitle id="form-dialog-title" className={styles.header}>
          Add Repository
        </DialogTitle>
        {message}
        <DialogContent className={styles.content}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="password"
            label="Access Token"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" style={{ color: 'grey' }}>
                  {toolTip}
                </InputAdornment>
              ),
            }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="projectUrl"
            label="Project repo URL"
            type="text"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions className={styles.dialogAction}>
          <Grid item xs={6}>
            <Button className={clsx(styles.button, styles.cancel)} onClick={handleCancel} >
              Cancel
            </Button> 
          </Grid>

          <Grid item xs={6}>
            <Button className={clsx(styles.button, styles.add)} onClick={handleSubmit} >
              Add to list
            </Button> 
          </Grid>
        </DialogActions>
        </Container>
      </Dialog>
  )
}

AddRepositoryDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
}

export default AddRepositoryDialog
