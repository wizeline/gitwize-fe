import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import styled from 'styled-components'
import { useOktaAuth } from '@okta/okta-react'

import Iframe from '../components/Iframe'

const useStyles = makeStyles(() => ({
  root: {},
  header: {
    borderBottom: '1px solid #E5E5E5',
    height: '105px',
  },
  headerContent: {
    height: '100%',
    alignItems: 'center',
    padding: '0 63px',
  },
  content: {
    backgroundColor: '#F8F8F8',
    height: '100vh',
    paddingTop: '100px !important',
  },
  textField: {
    paddingRight: '65px',
    marginLeft: 160
  },
  text: {
    marginBottom: '50px',
  },
  button: {
    backgroundColor: '#EC5D5C !important',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.24)',
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
}))

const Title = styled.h1`
  font-size: 2.6rem;
  font-style: medium;
`

const Text = styled.p`
  color: #aaaaaa;
  font-size: 1.3rem;
`

export default function LandingPage() {
  const styles = useStyles()
  const { authService } = useOktaAuth()

  const login = async () => {
    authService.login('/')
  }

  return (
    <Grid container className={styles.root}>
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
              <Title className={styles.text}>Actionable metrics for engineering leaders.</Title>
              <Text className={styles.text}>
                Gitwize turns data from commits, pull requests and code into insights you can use to drive engineering
                productivity. Make data-backed decision based on a complete understanding of how your team is working.
              </Text>
              <Button className={styles.button} onClick={login}>
                Get Started
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Iframe />
            </Grid>
          </Grid>
      </Grid>
    </Grid>
  )
}
