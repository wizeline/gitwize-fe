import React from 'react'
import { shallow } from 'enzyme'
import * as oktaLib from '@okta/okta-react'
import { Button, Header } from 'semantic-ui-react'
import Home from './Home'

jest.mock('@okta/okta-react')

describe('Home component', () => {
  it('renders without crashing', () => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {}
      }
    })
    const component = shallow(<Home />)
    expect(component.length).toBe(1)
  })

  it('renders when pending', () => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: { isPending: true },
        authService: {}
      }
    })
    const component = shallow(<Home />)
    expect(component.contains(<div> Loading ...</div>)).toBe(true)
  })

  it('renders when not login', () => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {}
      }
    })
    const component = shallow(<Home />)
    expect(component.find(Header).length).toBe(1)
    expect(component.find(Button).length).toBe(1)
  })

  it('renders when login', () => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: { isAuthenticated: true },
        authService: {
          getUser: () => {
            'userName'
          }
        }
      }
    })
    const component = shallow(<Home />)
    expect(component.find(Header).length).toBe(1)
    expect(component.find(Button).length).toBe(0)
  })
})
