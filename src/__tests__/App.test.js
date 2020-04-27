import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import axios from 'axios'
import App, { Counter, dataReducer } from '../App'

const list = ['a', 'b', 'c']

describe('App', () => {
  test('snapshot renders', () => {
    const component = renderer.create(<App />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('Reducer', () => {
    it('should set a list', () => {
      const state = { list: [], error: null }
      const newState = dataReducer(state, {
        type: 'SET_LIST',
        list
      })

      expect(newState).toEqual({ list, error: null })
    })

    it('should reset the error if list is set', () => {
      const state = { list: [], error: true }
      const newState = dataReducer(state, {
        type: 'SET_LIST',
        list
      })

      expect(newState).toEqual({ list, error: null })
    })

    it('should set the error', () => {
      const state = { list: [], error: null }
      const newState = dataReducer(state, {
        type: 'SET_ERROR'
      })

      expect(newState.error).toBeTruthy()
    })
  })

  describe('Counter', () => {
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

  it('fetches async data', () => {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            hits: [
              { objectID: '1', title: 'a' },
              { objectID: '2', title: 'b' }
            ]
          }
        })
      })
    })

    axios.get = jest.fn(() => promise)

    const wrapper = mount(<App />)

    promise.then(() => {
      setImmediate(() => {
        expect(wrapper.find('li').length).toEqual(0)
        expect(wrapper.find('.error').length).toEqual(1)

        axios.get.mockClear()
      })
    })
  })
})
