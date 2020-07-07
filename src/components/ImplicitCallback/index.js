import React from 'react'
import ErrorRedirect from './ErrorRedirect'
import { LoginCallback } from '@okta/okta-react'

const ImplicitCallback = () => (<LoginCallback errorComponent={ErrorRedirect} />);

export default ImplicitCallback