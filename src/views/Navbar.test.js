import React from 'react'
import { shallow } from 'enzyme'
import * as oktaLib from '@okta/okta-react'
import Navbar from './Navbar'

jest.mock('@okta/okta-react')

describe('Navbar component', () => {
  it('renders without crashing', () => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {}
      }
    })
    const component = shallow(<Navbar />)

    expect(component.length).toBe(1)
  })

  it('renders without login', () => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {}
      }
    })
    const component = shallow(<Navbar />)

    expect(component.contains('Login')).toBe(true)
  })

  it('renders without login', () => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: { isAuthenticated: true },
        authService: {}
      }
    })
    const component = shallow(<Navbar />)

    expect(component.contains('Logout')).toBe(true)
  })
})
