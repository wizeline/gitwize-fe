/**
 * @jest-environment node
 */
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { ApiHttpClient } from './base'

const BASE_URL = 'https://example.com'
const ACCESS_TOKEN = 'eyJraWQiOiJKaDdOZF9md25vdE9ZeWw4QVp4djNOWjdNbTZRdzIwOU9QR'
const NEW_ACCESS_TOKEN = 'eyJraWQiOiJKaDdkgkfngkfgnskfnsdkfnsdkfnsdfkjNOWjdNbTZRdzIwOU9QR'

describe('ApiHttpClient', () => {
  const apiHttpClient = new ApiHttpClient({ baseURL: BASE_URL })

  const authService = {
    getTokenManager: function() {
      return {
        get: function (accessToken) {
          return new Promise((resolve) => {
            resolve({
              accessToken: ACCESS_TOKEN,
            })
          })
        },
        renew: function (accessToken) {
          return new Promise((resolve) => {
            resolve({
              accessToken: NEW_ACCESS_TOKEN,
            })
          })
        },
      }
    }
   
  }

  test('should attach access token to the header', async () => {
    apiHttpClient.setAuthService(authService)
    const axiosMockAdapter = new AxiosMockAdapter(axios)
    axiosMockAdapter.onGet(BASE_URL).reply(200, '')

    const response = await apiHttpClient.getHttpClient().get(BASE_URL)

    expect(response.config.headers.Authorization).toStrictEqual(`Bearer ${ACCESS_TOKEN}`)
  })

  
})
