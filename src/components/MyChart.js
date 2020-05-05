import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { dataFunction, filterAll, mapTable, filterTable, initialReformat } from '../utils.js'

const Data = require('../data.json')

function MyChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    let formattedData = []
    formattedData = mapTable(filterTable(initialReformat(Data)))
    setData(formattedData)
  }, [])

  let filteredData = []
  const finalData = []
  let i = 0
  if (data.length > 0) {
    // format data so that data can be utilised by year... [title: {year: [obj_with_data, ...], ...}, ...]
    filteredData = filterAll(dataFunction(data))
    // what exact countries do I want to show data for?
    filteredData = filteredData['Knowlege about sexual transmission of AIDS']
    // set each country as a 'dataKey' with value what is shown on the chart.
    for (const year in filteredData) {
      finalData.push({ year })
      filteredData[year].forEach(obj => {
        // do this in case there is a male and female to average the data between gender
        if (parseFloat(finalData[i][obj.country]) > 0) {
          finalData[i][obj.country] = (finalData[i][obj.country] + +obj.value) / 2
        }
        // otherwise set to value if only male or female, or first instance of either
        else finalData[i][obj.country] = +obj.value
      })
      i++
    }

    console.log(finalData)
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart cx="50%" cy="50%" outerRadius="80%" data={finalData}>
        <XAxis dataKey="year" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Line connectNulls type="monotone" dataKey="Zambia" stroke="black" />
        <Line connectNulls type="monotone" dataKey="Bangladesh" stroke="green" />
        <Line
          connectNulls
          type="monotone"
          dataKey="Bolivia (Plurinational State of)"
          stroke="purple"
        />
        <Line connectNulls type="monotone" dataKey="Cameroon" stroke="orange" />
        <Line connectNulls type="monotone" dataKey="Ghana" stroke="brown" />
        <Line connectNulls type="monotone" dataKey="Malawi" stroke="#C90016" />
        <Line connectNulls type="monotone" dataKey="Nepal" stroke="red" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default MyChart
