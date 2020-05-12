const localStorageService = (function() {
  let service

  function getService() {
    if (!service) {
      service = this
    }

    return service
  }

  function setToken(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  function getAccessToken() {
    return localStorage.getItem('access_token')
  }
  function getRefreshToken() {
    return localStorage.getItem('refresh_token')
  }
  function clearToken() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
  return {
    getService,
    setToken,
    getAccessToken,
    getRefreshToken,
    clearToken
  }
})()

export default localStorageService
