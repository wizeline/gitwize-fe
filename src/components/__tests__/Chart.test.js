import React from 'react'
import { shallow } from 'enzyme'
import Chart from '../Chart'

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
]

describe('Chart', () => {
  test('render withour crashing', () => {
    const wrapper = shallow(<Chart xAxis="name" data={data} lines={['uv', 'pv']} bars={['amt']} />)

    expect(wrapper.find('ComposedChart').length).toBe(1)
  })

  it('should match snapshot renders', () => {
    const component = shallow(
      <Chart xAxis="name" data={data} lines={['uv', 'pv']} bars={['amt']} />
    )
    expect(component).toMatchSnapshot()
  })

  test('There should be a combination of bar and Line Chart', () => {
    const wrapper = shallow(<Chart xAxis="name" data={data} lines={['uv']} bars={['amt']} />)
    expect(wrapper.find('Line').length).toBe(1)
    expect(wrapper.find('Bar').length).toBe(1)
  })

  test('There should be only 2 lines of Line Chart', () => {
    const wrapper = shallow(<Chart xAxis="name" data={data} lines={['uv']} />)
    expect(wrapper.find('Line').length).toBe(1)
    expect(wrapper.find('Bar').length).toBe(0)
  })

  test('There should be only bars of Bar Chart', () => {
    const wrapper = shallow(<Chart xAxis="name" data={data} bars={['amt']} />)
    expect(wrapper.find('Line').length).toBe(0)
    expect(wrapper.find('Bar').length).toBe(1)
  })

  test('Draw correct data', () => {
    const wrapper = shallow(<Chart xAxis="name" data={data} lines={['uv', 'pv']} bars={['amt']} />)
    expect(wrapper.find('Line').length).toBe(2)
    expect(wrapper.find('Bar').length).toBe(1)
  })
})
