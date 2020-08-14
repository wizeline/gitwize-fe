import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

import { HttpClient } from './client'

const axiosMockAdapter = new AxiosMockAdapter(axios)

const baseURL = 'https://example.com'
const okBody = { message: 'OK' }
const koBody = { message: 'KO' }
const okQueryParams = { message: 'OK' }
const koQueryParams = { message: 'KO' }
const okResponse = { status: 'OK' }
const koResponse = { status: 'KO' }

axiosMockAdapter.onAny(`${baseURL}/`).reply(({ method, data, params }) => {
  const body = (data && JSON.parse(data)) || null
  const newMethod = method && method.toUpperCase()
  switch (newMethod) {
    case 'GET':
    case 'HEAD':
    case 'DELETE':
    case 'OPTIONS':
      // GET or DELETE or HEAD method should not have request body
      if (body) {
        return [500, okResponse]
      }
      if (params && params.message === 'KO') {
        return [500, koResponse]
      }
      // HEAD method never has response body
      if (newMethod === 'HEAD') {
        return [200, '']
      }
      return [200, okResponse]
    case 'POST':
    case 'PATCH':
    case 'PUT':
      if (body && body.message === 'KO') {
        return [500, koResponse]
      }
      return [200, okResponse]
    default:
      break
  }

  return [500, { status: 'KO' }]
})

class TestHttpService extends HttpClient {
  constructor() {
    super({ baseURL })
  }

  async testGet(options) {
    return this.get('/', options)
  }

  async testPatch(options) {
    return this.patch('/', options)
  }

  async testPost(options) {
    return this.post('/', options)
  }

  async testPut(options) {
    return this.put('/', options)
  }

  async testDelete(options) {
    return this.delete('/', options)
  }

  async testOptions(options) {
    return this.options('/', options)
  }

  async testHead(options) {
    return this.head('/', options)
  }
}

describe('Test HttpService', () => {
  const httpService = new TestHttpService()

  const requestBodyError = 'GET, HEAD, OPTIONS, DELETE must not have request body !'
  const noRequestBodyError = 'POST, PUT, PATCH must have request body !'

  test('have HTTP Client instance', () => {
    expect(httpService.getHttpClient()).toBeDefined()
    expect(httpService.getHttpClient().defaults.baseURL).toStrictEqual(baseURL)
  })

  test('be KO when sending KO request (simulate validation) for all methods', () => {
    const assertKOResponse = async (testResponse) => {
      await expect(testResponse).rejects.toThrowError('Request failed with status code 500')
    }

    assertKOResponse(httpService.testGet({ queryParams: koQueryParams }))
    assertKOResponse(httpService.testHead({ queryParams: koQueryParams }))
    assertKOResponse(httpService.testOptions({ queryParams: koQueryParams }))
    assertKOResponse(httpService.testDelete({ queryParams: koQueryParams }))

    assertKOResponse(httpService.testPost({ body: koBody }))
    assertKOResponse(httpService.testPut({ body: koBody }))
    assertKOResponse(httpService.testPatch({ body: koBody }))
  })

  test('be OK when using get() method with or without query params', async () => {
    const response1 = await httpService.testGet({})
    expect(response1).toStrictEqual(okResponse)

    const response2 = await httpService.testGet({ queryParams: okQueryParams })
    expect(response2).toStrictEqual(okResponse)
  })

  test('be KO when using get() method with request body', async () => {
    await expect(httpService.testGet({ body: okBody })).rejects.toThrow(requestBodyError)
  })

  test('be OK when using put() method with request body and query params', async () => {
    const response = await httpService.testPut({ body: okBody })
    expect(response).toStrictEqual(okResponse)

    const response2 = await httpService.testPut({ body: okBody, queryParams: okQueryParams })
    expect(response2).toStrictEqual(okResponse)
  })

  test('be KO when using put() method without request body', async () => {
    await expect(httpService.testPut({})).rejects.toThrow(noRequestBodyError)
  })

  test('be OK when using post() method with request body and query params', async () => {
    const response1 = await httpService.testPost({ body: okBody })
    expect(response1).toStrictEqual(okResponse)

    const response2 = await httpService.testPost({ body: okBody, queryParams: okQueryParams })
    expect(response2).toStrictEqual(okResponse)
  })

  test('be KO when using post() method without request body', async () => {
    await expect(httpService.testPost({})).rejects.toThrow(noRequestBodyError)
  })

  test('be OK when using patch() method with request body and query params', async () => {
    const response1 = await httpService.testPatch({ body: okBody })
    expect(response1).toStrictEqual(okResponse)

    const response2 = await httpService.testPatch({ body: okBody, queryParams: okQueryParams })
    expect(response2).toStrictEqual(okResponse)
  })

  test('be KO when using patch() method without request body', async () => {
    await expect(httpService.testPatch({})).rejects.toThrow(noRequestBodyError)
  })

  test('be OK when using delete() method with or without query params', async () => {
    const response1 = await httpService.testDelete({})
    expect(response1).toStrictEqual(okResponse)

    const response2 = await httpService.testDelete({ queryParams: okBody })
    expect(response2).toStrictEqual(okResponse)
  })

  test('be KO when using delete() method with request body', async () => {
    await expect(httpService.testDelete({ body: okBody })).rejects.toThrow(requestBodyError)
  })

  test('be OK when using options() with or without query params', async () => {
    const response1 = await httpService.testOptions({})
    expect(response1).toStrictEqual(okResponse)

    const response2 = await httpService.testOptions({ queryParams: okQueryParams })
    expect(response2).toStrictEqual(okResponse)
  })

  test('be KO when using options() with request body', async () => {
    await expect(httpService.testOptions({ body: okBody })).rejects.toThrow(requestBodyError)
  })

  test('be OK when using head() with or without query params', async () => {
    const response1 = await httpService.testHead({})
    expect(response1).toStrictEqual('')

    const response2 = await httpService.testHead({ queryParams: okQueryParams })
    expect(response2).toStrictEqual('')
  })

  test('be KO when using head() with request body', async () => {
    await expect(httpService.testHead({ body: okBody })).rejects.toThrow(requestBodyError)
  })
})
