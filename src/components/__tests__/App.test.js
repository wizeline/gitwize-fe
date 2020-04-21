import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import App, { Counter, dataReducer } from '../App'

const list = ['a', 'b', 'c']

describe('App', () => {
  test('snapshot renders', () => {
    const component = renderer.create(<App />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the inner Counter', () => {
    const wrapper = mount(<App />)
    expect(wrapper.find(Counter).length).toEqual(1)
  })

  it('passes all props to Counter', () => {
    const wrapper = mount(<App />)
    const counterWrapper = wrapper.find(Counter)
    expect(counterWrapper.find('p').text()).toEqual('0')
  })

  it('increments the counter', () => {
    const wrapper = mount(<App />)
    wrapper
      .find('button')
      .at(0)
      .simulate('click')
    const counterWrapper = wrapper.find(Counter)
    expect(counterWrapper.find('p').text()).toBe('1')
  })

  it('decrements the counter', () => {
    const wrapper = mount(<App />)
    wrapper
      .find('button')
      .at(1)
      .simulate('click')
    const counterWrapper = wrapper.find(Counter)
    expect(counterWrapper.find('p').text()).toBe('-1')
  })
})
