import React from 'react'
import {mount, shallow} from 'enzyme'
import DatePicker from '../index'
import renderer from 'react-test-renderer'

describe('DatePicker', () => {
  const labelName = 'Date Range'

  test('render the component correctly', () => {
    const onChange = jest.fn(),
      props = {
        label: labelName,
        onChange
      }

    const wrapper = mount(<DatePicker {...props} />);
    expect(wrapper.find(DatePicker).exists()).toEqual(true)
    expect(wrapper.find(DatePicker).prop('label')).toEqual(labelName)
  })

  test('check dropdown displayed', () => {
    const onChange = jest.fn(),
      props = {
        label: labelName,
        onChange
      }


    const wrapper = renderer.create(<DatePicker {...props} />).toJSON()

    expect(wrapper).toMatchSnapshot()
    //const textField = wrapper.find('#standard-helperText')
    //expect(textField).exists().toEqual(true)

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