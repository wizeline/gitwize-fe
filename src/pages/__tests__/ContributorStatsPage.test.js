import React from 'react'
import { mount } from 'enzyme'
import { PageProvider } from '../../contexts/PageContext'
import * as oktaLib from '@okta/okta-react'
import ContributorStatsPage from '../ContributorStatsPage'

jest.mock('@okta/okta-react')

describe('Contributor stats page', () => {
  beforeEach(() => {
    oktaLib.useOktaAuth.mockImplementation(() => {
      return {
        authState: {},
        authService: {
          getTokenManager: function() {
            return 
          }
        },
      }
    })
  });
  it('render without crashing component', () => {
    const wrapper = mount(
      <PageProvider>
        <ContributorStatsPage match={{params: {id: 1}, isExact: true, path: "", url: ""}}/>
      </PageProvider>
    )
    expect(wrapper.length).toBe(1)
  })
})
