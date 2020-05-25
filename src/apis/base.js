import { HttpClient } from '../clients/http/client'

export class ApiHttpClient extends HttpClient {
  constructor(config) {
    super(config)
    this.getHttpClient().interceptors.request.use(this.authInterceptor)
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken
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
