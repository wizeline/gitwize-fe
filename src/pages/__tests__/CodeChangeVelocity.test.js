import React from 'react'
import { mount } from 'enzyme'
import CodeChangeVelocity from '../CodeChangeVelocity'
import { PageProvider } from '../../contexts/PageContext'
import * as oktaLib from '@okta/okta-react'

jest.mock('@okta/okta-react')

describe('Code change velocity', () => {
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
        <CodeChangeVelocity match={{params: {id: 1}, isExact: true, path: "", url: ""}}/>
      </PageProvider>
    )
    expect(wrapper.length).toBe(1)
  })
})
