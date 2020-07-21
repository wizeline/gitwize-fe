import { HttpClient } from '../clients/http/client'
import axios from 'axios'

export class ApiHttpClient extends HttpClient {
  constructor(config) {
    super(config)
    let isRefreshing = false
    let failedQueue = []

    this.getHttpClient().interceptors.request.use(this.authInterceptor)

    this.getHttpClient().interceptors.response.use((response) => {
      return response
    }, this.interceptor)
  }

  shouldIntercept = (error) => {
    try {
      return error.response.status === 401
    } catch (e) {
      return false
    }
  }

  attachTokenToRequest = (request, token) => {
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  handleTokenRefresh = () => {
    return new Promise((resolve, reject) => {
      this.tokenManager
        .renew('accessToken')
        .then((token) => {
          resolve(token.accessToken)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  interceptor = (error) => {
    if (!this.shouldIntercept(error)) {
      return Promise.reject(error)
    }

    if (error.config._retry || error.config._queued) {
      return Promise.reject(error)
    }

    const originalRequest = error.config

    return new Promise((resolve, reject) => {
      this.handleTokenRefresh
        .call(this.handleTokenRefresh)
        .then((token) => {
          console.log('handleTokenRefresh response', token)
          this.attachTokenToRequest(originalRequest, token)
          resolve(axios(originalRequest))
        })
        .catch((err) => {
          reject(err)
        })
    })

    return Promise.reject(error)
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken
  }

  setTokenManager(tokenManager) {
    this.tokenManager = tokenManager
  }

  authInterceptor = (config) => {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${this.accessToken}`,
    }

    return config
  }
}

export class BaseApiClient {
  constructor(httpClient) {
    this.httpClient = httpClient
  }
}
