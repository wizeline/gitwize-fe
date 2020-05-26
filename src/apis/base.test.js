/**
 * @jest-environment node
 */
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { ApiHttpClient } from './base'

const BASE_URL = 'https://example.com'
const ACCESS_TOKEN = 'eyJraWQiOiJKaDdOZF9md25vdE9ZeWw4QVp4djNOWjdNbTZRdzIwOU9QR'

describe('ApiHttpClient', () => {
  const apiHttpClient = new ApiHttpClient({ baseURL: BASE_URL })

  test('should attach access token to the header', async () => {
    apiHttpClient.setAccessToken(ACCESS_TOKEN)
    const axiosMockAdapter = new AxiosMockAdapter(axios)
    axiosMockAdapter.onGet(BASE_URL).reply(200, '')

    const response = await apiHttpClient.getHttpClient().get(BASE_URL)

    expect(response.config.headers.Authorization).toStrictEqual(`Bearer ${ACCESS_TOKEN}`)
  })
})
