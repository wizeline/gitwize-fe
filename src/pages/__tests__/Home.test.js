import React from 'react'
import { mount } from 'enzyme'
import { PageProvider } from '../../contexts/PageContext'
import * as oktaLib from '@okta/okta-react'
import Home from '../Home'

jest.mock('@okta/okta-react')
jest.mock('../../apis', () => {
  const mockResponse = {
    id: 1,
    name: 'gitwize',
    status: 'ONGOING',
    url: 'https://github.com/gitwize',
    branches: ['master', 'dev'],
    last_updated: '2020-05-30T11:32:00.000-04:00',
  }
  return {
    ApiClient: jest.fn().mockImplementation(() => ({
      repos: {
        getRepoDetail: jest.fn().mockReturnValue(Promise.resolve(mockResponse)),
      },
      setAccessToken: jest.fn(),
    })),
  }
})

describe('Home page', () => {
  beforeEach(() => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {
          getTokenManager: ()=> {
            return 'token'
          }
        },
      }
    })
  })
  it('render without crashing component', () => {
    const wrapper = mount(
      <PageProvider>
        <Home />
      </PageProvider>
		)
		expect(wrapper.length).toBe(1)
  })
})
