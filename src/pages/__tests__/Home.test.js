import React from 'react'
import { mount } from 'enzyme'
import { PageProvider } from '../../contexts/PageContext'
import Home from '../Home'
import {} from ''
import { useAuth } from '../../hooks/authService'

jest.mock('../../hooks/authService')
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
        listRepo: jest.fn().mockReturnValue(Promise.resolve([mockResponse]))
      },
      setAccessToken: jest.fn(),
      setAuthService: jest.fn()
    })),
  }
})

describe('Home page', () => {
  beforeEach(() => {
    useAuth.mockImplementation(() => {
      return {
        authState: {
          isAuthenticated: true
        },
        authService: {
          getTokenManager: ()=> {
            return 'token'
          },
          getUser: () => {
            return 'test'
          }
        },
      }
    })
  })
  it('render without crashing component', () => {
    const wrapper = mount(
      <PageProvider>
        <Home/>
      </PageProvider>
		)
		expect(wrapper.length).toBe(1)
  })
})
