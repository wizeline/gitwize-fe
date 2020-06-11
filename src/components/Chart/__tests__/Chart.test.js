import React from 'react'
import { shallow, mount } from 'enzyme'
import Chart from '../index'
import {transformToChartData} from '../../../utils/dataUtils'

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

describe('Chart', () => {
  it('render withour crashing', () => {
    const chartData = transformToChartData([{name: 'uv'}, {name: 'pv'}], [{name: 'amt'}], data, "name")
    const wrapper = mount(<Chart data={chartData}/>)
    expect(wrapper.find('Bar').length).toBe(1)
  })

  it('There should be a combination of bar and Line Chart', () => {
    const chartData = transformToChartData([{name: 'uv'}], [{name: 'amt'}], data, "name")
    const wrapper = mount(<Chart data={chartData} />)
    const bar = (wrapper.find('Bar'))
    const dataSets = bar.props().data.datasets
    expect(dataSets[0].type).toBe('line')
    expect(dataSets[1].type).toBe('bar')
  })

  test('There should be only 2 lines of Line Chart', () => {
    const chartData = transformToChartData([{name: 'uv'}, {name: 'pv'}], [], data, "name")
    const wrapper = mount(<Chart data={chartData}/>)
    const bar = (wrapper.find('Bar'))
    const dataSets = bar.props().data.datasets
    expect(dataSets[0].type).toBe('line')
    expect(dataSets[1].type).toBe('line')
  })

  test('There should be only bars of Bar Chart', () => {
    const chartData = transformToChartData([], [{name: 'amt'}], data, "name")
    const wrapper = mount(<Chart data={chartData}/>)
    const bar = (wrapper.find('Bar'))
    const dataSets = bar.props().data.datasets
    expect(dataSets[0].type).toBe('bar')
  })
})
