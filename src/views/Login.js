import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'

import OktaImg from '../assets/images/okta.png'

import styles from './Login.module.css'

function Login({ handleLogin }) {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <img className={styles.logo} alt="okta" src={OktaImg} />
        <Button className={styles.button} onClick={handleLogin}>
          Login with Okta
        </Button>
      </div>
    </div>
  )
}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
}

Login.defaultProps = {
  handleLogin: () => {},
}

export default Login
