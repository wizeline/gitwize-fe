import React from 'react'
import { shallow } from 'enzyme'
import BranchFilter from '../index'

describe('BranchFilter', () => {
  test('render without crashing', () => {
    const wrapper = shallow(<BranchFilter />)
    expect(wrapper.find('DropdownList').length).toBe(2)
  })

  test('should have branch picker', () => {
    const filter = shallow(<BranchFilter />)
    const dropdown = filter.find('DropdownList')

    expect(dropdown.at(0).props().label).toBe('Branch')
  })

  test('should have show picker', () => {
    const filter = shallow(<BranchFilter />)
    const dropdown = filter.find('DropdownList')

    expect(dropdown.at(1).props().label).toBe('Period')
  })
})
