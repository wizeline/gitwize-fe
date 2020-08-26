import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

import LandingPageImage from '../assets/images/landingpage.png'
import {useAuth} from '../hooks/authService'
import SocialLoginButton from '../components/SocialLoginButton'

const useStyles = makeStyles(() => ({
  root: {},
  header: {
    borderBottom: '1px solid #E5E5E5',
    height: '105px',
  },
  headerContent: {
    alignItems: 'center',
    padding: '0 63px',
  },
  content: {
    backgroundColor: '#FFFFFF',
    paddingTop: '100px !important',
    height: '100vh'
  },
  textField: {
    paddingRight: '65px',
    marginLeft: 160,
    
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins',
    lineHeight: '42px',
    letterSpacing: '0.01em',
    marginBottom: '50px',
    fontWeight: 500
  },
  text: {
    marginBottom: '50px',
    fontWeight: 500,
    color: '#aaaaaa',
    fontSize: 13,
    lineHeight: '19px'
  },
  button: {
    backgroundColor: '#EC5D5C !important',
    borderRadius: '8px',
    fontStyle: 'normal',
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: '13px',
    lineHeight: '19px',
    /* identical to box height */

    textAlign: 'center',
    letterSpacing: '0.01em',

    /* white */

    color: '#ffffff !important',
    width: '200px',
    textTransform: 'none'
  },
  logoText: {
    fontStyle: 'normal',
    /* identical to box height */
    textAlign: 'center',
    color: '#000000',
    fontSize: '25px',
    fontFamily: 'Open Sans !important'
  },
  logoTextBold: {
    fontWeight: 'bold',
    fontSize: '25px',
    fontFamily: 'Open Sans !important'
  },
  image: {
    height: '100%',
    width: '100%'
  }
}))

export default function LandingPage() {
  const styles = useStyles()
  const {authService} = useAuth()

  // const login = async (userInfor) => {
  //   //TODO: Redirect to login pages 
  // }

  const handleSocialLoginSuccess = (response) => {
    authService.login(response)
  }
   
  const handleSocialLoginFailure = (err) => {
    console.error(err)
  }

  return (
    <Grid container>
      <Grid item xs={12} className={styles.header}>
        <Grid container className={styles.headerContent}>
          <Grid item className={styles.logoTextBold}>
            Git
          </Grid>
          <Grid item className={styles.logoText}>
            Wize
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={styles.content}>
          <Grid container>
            <Grid item xs={4} className={styles.textField}>
              <div className={styles.title}>Actionable metrics for engineering leaders.</div>
              <div className={styles.text}>
                Gitwize turns data from commits, pull requests and code into insights you can use to drive engineering
                productivity. Make data-backed decision based on a complete understanding of how your team is working.
              </div>
              <SocialLoginButton
                handleLoginSuccess={handleSocialLoginSuccess}
                handleLoginFailure={handleSocialLoginFailure}
                customRender={renderProps => (
                  <Button className={styles.button} onClick={renderProps.onClick}>
                    Get Started
                  </Button>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <img src={LandingPageImage} className={styles.image} alt='landing page'/>
            </Grid>
          </Grid>
      </Grid>
    </Grid>
  )
}
