import React from 'react'
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Legend } from 'recharts'
import PropTypes from 'prop-types'
import { getChartColor } from '../utils/chartUtils'

function Chart(props) {
  const { xAxis, data, lines, bars } = props

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <XAxis dataKey={xAxis} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Legend />
        <Tooltip />

        {bars.map((bar) => (
          <Bar dataKey={bar} fill={getChartColor(bar)} barSize={10} isAnimationActive={false} key={bar} />
        ))}

        {lines.map((line, index) => (
          <Line
            connectNulls
            type="monotone"
            dataKey={line}
            isAnimationActive={false}
            stroke={getChartColor(line)}
            strokeDasharray={lines.length > 1 && index + 1 === lines.length ? '4 4' : ''}
            key={line}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

Chart.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  xAxis: PropTypes.string.isRequired,
  lines: PropTypes.instanceOf(Array),
  bars: PropTypes.instanceOf(Array),
}

Chart.defaultProps = {
  lines: [],
  bars: [],
}

export default Chart
