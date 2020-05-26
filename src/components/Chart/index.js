import React from 'react'
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Legend } from 'recharts'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import { getChartColor } from '../../utils/chartUtils'

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    marginBottom: theme.spacing(6),
    padding:'30px 40px 30px 10px'
  }
}))

export default function Chart(props) {
  const { xAxis, data, lines, bars } = props
  const classes = useStyles()

  return (
    <Paper className={classes.root}>
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <XAxis dataKey={xAxis} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
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
    </Paper>
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
