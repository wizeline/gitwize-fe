import React from 'react'
import { Button } from '@material-ui/core'
import styles from './Login.module.css'
import OktaImg from '../assets/images/okta.png'

export default function Login(props) {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <img className={styles.logo} alt="okta" src={OktaImg} />
        <Button className={styles.button} onClick={props.handleLogin}>Login with Okta</Button>
      </div>
    </div>
  )
}
