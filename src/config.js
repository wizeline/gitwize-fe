const {
  REACT_APP_BASE_URL,
  REACT_APP_OKTA_CLIENT_ID,
  REACT_APP_OKTA_ISSUER,
  REACT_APP_OKTA_DISABLE_HTTPS_CHECK,
  REACT_APP_GOOGLE_APP_ID
} = process.env

export const AppIds = {
  GOOGLE_ID: REACT_APP_GOOGLE_APP_ID
}

export default {
  oidc: {
    clientId: REACT_APP_OKTA_CLIENT_ID,
    issuer: REACT_APP_OKTA_ISSUER,
    redirectUri: `${REACT_APP_BASE_URL}/implicit/callback`,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: REACT_APP_OKTA_DISABLE_HTTPS_CHECK,
    onSessionExpired: () => {}
  },
}
