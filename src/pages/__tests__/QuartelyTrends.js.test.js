import React from 'react'
import { mount } from 'enzyme'
import { PageProvider } from '../../contexts/PageContext'
import * as oktaLib from '@okta/okta-react'
import QuartelyTrends from '../QuartelyTrends'

jest.mock('@okta/okta-react')

describe('Quarterly trends', () => {
  beforeEach(() => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {},
      }
    })
  });
  it('render without crashing component', () => {
    const wrapper = mount(
      <PageProvider>
        <QuartelyTrends match={{params: {id: 1}, isExact: true, path: "", url: ""}}/>
      </PageProvider>
    )
    expect(wrapper.length).toBe(1)
  })
})
