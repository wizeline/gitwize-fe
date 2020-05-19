import axios from 'axios'

export class HttpClient {
  constructor({ baseURL, headers }) {
    this.httpClient = axios.create({
      baseURL,
      headers,
      withCredentials: true,
      timeout: 30000,
    })
  }

  getHttpClient() {
    return this.httpClient
  }

  get(url, options = {}) {
    return this.request('GET', url, options)
  }

  head(url, options = {}) {
    return this.request('HEAD', url, options)
  }

  put(url, options = {}) {
    return this.request('PUT', url, options)
  }

  patch(url, options = {}) {
    return this.request('PATCH', url, options)
  }

  post(url, options = {}) {
    return this.request('POST', url, options)
  }

  delete(url, options = {}) {
    return this.request('DELETE', url, options)
  }

  options(url, options = {}) {
    return this.request('OPTIONS', url, options)
  }

  async request(method, url, options = {}) {
    const { queryParams, body } = options

    if (body && (method === 'GET' || method === 'HEAD' || method === 'DELETE' || method === 'OPTIONS')) {
      const msg = 'GET, HEAD, OPTIONS, DELETE must not have request body !'
      throw new Error(msg)
    }

    if (!body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      const msg = 'POST, PUT, PATCH must have request body !'
      throw new Error(msg)
    }

    const { data } = await this.httpClient.request({
      method,
      url,
      params: queryParams,
      data: body,
    })

    return data
  }
}
