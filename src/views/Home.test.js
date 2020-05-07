import React from 'react'
import { shallow } from 'enzyme'
import Home from './Home'

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {},
      authService: {}
    }
  }
}))

describe('Home component', () => {
  const component = shallow(<Home />)

  it('renders without crashing', () => {
    expect(component.length).toBe(1)
  })
})
