import React, { useContext, useRef, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles, styled } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container';

import MainLayoutContex from '../contexts/MainLayoutContext'
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '40px 0', 
    background: '#fff',
    width: '100%',
    height: '100vh',
    fontFamily: 'Poppins'
  },
  fourZeroFourBg: {
    backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
    height: '400px',
    backgroundPosition: 'center'
  },
  link404: {			
    backgroundColor: '#ec5d5c',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    margin: '20px 0',
    display: 'inline-block',
    fontStyle: 'normal',
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: '13px',
    lineHeight: '19px',
  },
  contantBox404: { 
    marginTop: '-50px',
    fontSize: '13px'
  }
}))

const ErrorCode = styled('h1')({
  fontSize: '85px',
  fontFamily: 'Poppins'
})

const ErrorMessage = styled('h3')({
  fontSize: '30x',
  fontFamily: 'Poppins'
})

export default function NotFoundError404() {
  const styles = useStyles()
  const mainLayout = useRef(useContext(MainLayoutContex))

  useEffect(() => {
    mainLayout.current.handleShowNavbar(false)
    document.body.style.backgroundColor = "#fff"
  })

  return (
    <Grid container className={styles.root} align="center">
	    <Container>
        <Grid item xs={8}>
		      <div className={styles.fourZeroFourBg}>
			    <ErrorCode>404</ErrorCode>
		      </div>
		
		    <div className={styles.contantBox404}>
		      <ErrorMessage>Look like you're lost</ErrorMessage>
		      <p>the page you are looking for not avaible!</p>
		      <a href="/" className={styles.link404}>Go to Home</a>
	      </div>
		    </Grid>
	    </Container>
    </Grid>
  )
}