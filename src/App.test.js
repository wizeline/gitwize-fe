import React from 'react'
import { shallow } from 'enzyme'
import App from './App'

describe('App component', () => {
  const component = shallow(<App />)

  it('renders without crashing', () => {
    expect(component.length).toBe(1)
  })
})
