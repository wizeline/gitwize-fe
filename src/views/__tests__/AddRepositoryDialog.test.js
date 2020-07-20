import React from 'react'
import { mount } from 'enzyme'
import AddRepositoryDialog from '../AddRepositoryDialog'

jest.mock('@okta/okta-react')

describe('Add repository dialog', () => {
  it('render without crashing component', () => {
    const wrapper = mount(
        <AddRepositoryDialog/>
    )
    expect(wrapper.length).toBe(1)
  })
  it('render add repo error', () => {
    const wrapper = mount(
        <AddRepositoryDialog isOpen={true} addingRepoError={{errorKey: 'common.badJsonFormat'}}/>
    )
    const errorDiv = (wrapper.find('div[children="Repo URL not found"]'))
    expect(errorDiv.length).toBe(1)
  })
})
