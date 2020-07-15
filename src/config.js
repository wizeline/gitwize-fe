const {
  REACT_APP_BASE_URL,
  REACT_APP_OKTA_CLIENT_ID,
  REACT_APP_OKTA_ISSUER,
  REACT_APP_OKTA_DISABLE_HTTPS_CHECK,
} = process.env

export default {
  oidc: {
    clientId: REACT_APP_OKTA_CLIENT_ID,
    issuer: REACT_APP_OKTA_ISSUER,
    redirectUri: `${REACT_APP_BASE_URL}/implicit/callback`,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: REACT_APP_OKTA_DISABLE_HTTPS_CHECK,
    tokenManager: {
      storage: 'sessionStorage',
      autoRenew: true
    }
  },
}
