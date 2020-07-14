import React from 'react'
import { mount } from 'enzyme'
import BranchPicker from '../index'
import { PageProvider } from '../../../contexts/PageContext'
import DropdownList from '../../DropdownList'
import { Grid } from '@material-ui/core'

describe('Branch filter', () => {
  it('render contains default components', () => {
    const wrapper = mount(
      <PageProvider>
        <BranchPicker/>
      </PageProvider>
    )
    expect(wrapper.contains('Branch')).toBe(true)
    expect(wrapper.contains('Period')).toBe(true)
    expect(wrapper.contains('Date Range')).toBe(true)
  })

  it('render contains custom components', () => {
    const customFilters = (<Grid item xs={2}>
                              <DropdownList label="User" data={["userA", "userB"]} initValue={"userA"} placeholder="Select a User"/>
                          </Grid>)
    const wrapper = mount(
      <PageProvider>
        <BranchPicker customFilters={customFilters}/>
      </PageProvider>
    )
    expect(wrapper.contains('User')).toBe(true)
  })

  it('render multi custom filters', () => {
    const customFilters = []
    customFilters.push(( <Grid item xs={2}>
                              <DropdownList label="User" data={["userA", "userB"]} initValue={"userA"} placeholder="Select a User"/>
                            </Grid>))
    customFilters.push(( <Grid item xs={2}>
                                <DropdownList label="filter 1" data={["1", "2"]} initValue={"1"} placeholder="Select a User"/>
                            </Grid>))
    customFilters.push((<Grid item xs={2}>
                                <DropdownList label="filter 2" data={["a", "b"]} initValue={"b"} placeholder="Select a User"/>
                            </Grid>))
    const wrapper = mount(
      <PageProvider>
        <BranchPicker customFilters={customFilters}/>
      </PageProvider>
    )
    expect(wrapper.contains('User')).toBe(true)
    expect(wrapper.contains('filter 1')).toBe(true)
    expect(wrapper.contains('filter 2')).toBe(true)
  })
})
