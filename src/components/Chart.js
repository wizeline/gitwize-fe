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
import { formatData, readDataFromFile } from '../utils.js'
import Papa from 'papaparse'
import 'babel-polyfill'

const fileName = 'HIVData.csv'

function Chart(props) {
  const [finalData, setFinalData] = useState([])

  useEffect(() => {

    const fetchData = async () => {
      let data = await  readDataFromFile(fileName)
      setFinalData(formatData(data))
    } 

    fetchData()

  }, [])



  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart cx="50%" cy="50%" outerRadius="80%" data={finalData}>
        <XAxis dataKey="year" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Line connectNulls type="monotone" dataKey="Zambia" stroke="black" isAnimationActive={false}/>
        <Line connectNulls type="monotone" dataKey="Bangladesh" stroke="green" isAnimationActive={false}/>
        <Line
          connectNulls
          type="monotone"
          dataKey="Bolivia (Plurinational State of)"
          stroke="purple"
        />
        <Line connectNulls type="monotone" dataKey="Cameroon" stroke="orange" isAnimationActive={false}/>
        <Line connectNulls type="monotone" dataKey="Ghana" stroke="brown" isAnimationActive={false}/>
        <Line connectNulls type="monotone" dataKey="Malawi" stroke="#C90016" isAnimationActive={false}/>
        <Line connectNulls type="monotone" dataKey="Nepal" stroke="red" isAnimationActive={false}/>
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Chart
