import React from 'react'
import { useOktaAuth } from '@okta/okta-react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core'
import styled from 'styled-components'
import Container from '@material-ui/core/Container';

import Iframe from '../components/Iframe'

const useStyles = makeStyles((theme) => ({
  root: {
    
  },
  header: {
    borderBottom: '1px solid #E5E5E5',
    height: '108px'
  },
  headerContent: {
    height: '100%',
    alignItems: 'center',
    padding: '0 10%'
  },
  content: {
    backgroundColor: '#F8F8F8',
    height: '100vh',
    paddingTop: '100px !important'
  },
  textField: {
    paddingRight: '65px'
  },
  text: {
    marginBottom: '50px'
  },
  button: {
    backgroundColor: '#000000 !important',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.24)',
    borderRadius: '4px',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '11px',
    lineHeight: '19px',
    /* identical to box height */

    textAlign: 'center',
    letterSpacing: '0.01em',

    /* white */

    color: '#ffffff !important',
    width: '200px'
  },
  logoText: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    /* identical to box height */
    textAlign: 'center',
    color: '#000000',
    fontSize: '28px'
  },
  logoTextBold: {
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: '28px'
  }
}))

const Title = styled.h1`
  font-size: 2.6rem;
  font-style: medium
`

const Text = styled.p`
  color: #AAAAAA;
  font-size: 1.3rem
`

export default function LandingPage({ handleLogin }) { 
  const styles = useStyles();
  const { authState, authService } = useOktaAuth()

  return (
      <Grid container spacing={2} className={styles.root}>
        <Grid item xs={12} className={styles.header}>
          <Grid container className={styles.headerContent}>
            <Grid item className={styles.logoTextBold}>Git</Grid>
            <Grid item className={styles.logoText}>Wize</Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={styles.content}>
          <Container spacing={2}>
            <Grid container>
              <Grid item xs={5} className={styles.textField}>
                <Title className={styles.text}>Actionable metrics for engineering leaders.</Title>
                <Text className={styles.text}>Gitwize turns data from commits, pull requests and code into insights you can use to drive engineering productivity. Make data-backed decision
                  based on a complete understanding of how your team is working.</Text>
                <Button className={styles.button} onClick={handleLogin}>
                  Get Started
                </Button>
              </Grid>
              <Grid item xs={7}><Iframe /></Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
  )
}