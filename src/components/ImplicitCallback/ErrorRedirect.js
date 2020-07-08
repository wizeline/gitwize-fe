import React from 'react'
import { Redirect } from 'react-router-dom';

const ErrorRedirect = ({error}) => (<Redirect to='/404/pagenotfound' />)
 
ErrorRedirect.defaultProps = {
  error: null
}
 
export default ErrorRedirect