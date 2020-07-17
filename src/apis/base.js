import { HttpClient } from '../clients/http/client'
import { getStartOfDateInSecond, getEndOfDateInSecond } from '../utils/dateUtils'

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

    if(config.params !== undefined) {
      const dateFrom = config.params.date_from
      const dateTo = config.params.date_to
      config.params = {
        ...config.params,
        date_from: getStartOfDateInSecond(dateFrom),
        date_to: getEndOfDateInSecond(dateTo)
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
