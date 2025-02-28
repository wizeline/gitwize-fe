import axios from 'axios'

import { getStartOfDateInSecond, getEndOfDateInSecond } from '../utils/dateUtils'
import { HttpClient } from '../clients/http/client'

export class ApiHttpClient extends HttpClient {
  constructor(config) {
    super(config)

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
      //TODO: Remove when backend ready for parse from google token
      AuthenticatedUser: 'nhan.nguyen'
    }
  }

  handleTokenRefresh = () => {
    return new Promise((resolve, reject) => {
      this.authService
        .getTokenManager()
        .renew('idToken')
        .then((token) => {
          resolve(token)
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

    const originalRequest = error.config

    return new Promise((resolve, reject) => {
      this.handleTokenRefresh
        .call(this.handleTokenRefresh)
        .then((token) => {
          this.attachTokenToRequest(originalRequest, token)
          resolve(axios(originalRequest))
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  setAuthService(authService) {
    this.authService = authService
  }

  sessionExpireHandler = () => {
    window.alert('Your session has expired. Please login again')
    this.authService.logout()
  }

  authInterceptor = async (config) => {
    await this.authService
      .getTokenManager()
      .getToken()
      .then((tokenObject) => {
        if (tokenObject === undefined || tokenObject.expireTime < (new Date()).getTime()) {
          this.sessionExpireHandler()
        } else {
          this.attachTokenToRequest(config, tokenObject.token)
        }
      })

    if (config.params !== undefined) {
      const dateFrom = config.params.date_from
      const dateTo = config.params.date_to
      config.params = {
        ...config.params,
        date_from: getStartOfDateInSecond(dateFrom),
        date_to: getEndOfDateInSecond(dateTo),
      }
    }

    return config
  }
}

export class BaseApiClient {
  constructor(httpClient) {
    this.httpClient = httpClient
  }
}
