import React from 'react'
import {mount} from 'enzyme'
import DatePicker from '../index'
import renderer from 'react-test-renderer'
import TextField from '@material-ui/core/TextField'

describe('DatePicker', () => {

  test('render the component correctly', () => {
    const onChange = jest.fn(),
      props = {
        label: "Date Range",
        onChange
      }

    const DatePickerComponent = mount(<DatePicker {...props}/>);
    const textField = DatePickerComponent.find('TextField')
    expect(DatePickerComponent).toMatchSnapshot()
    expect(DatePickerComponent.find('TextField')).to.have.lengthOf(1)
  })

  test('check dropdown displayed', () => {

  })

  test('check the onChange callback', () => {

    const onChange = jest.fn(),
      props = {
        label: "Date Range",
        onChange
      }

    const DatePickerComponent = mount(<DatePicker {...props} />)
  })


})