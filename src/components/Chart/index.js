import React from 'react'
// import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Legend } from 'recharts'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import {Bar} from 'react-chartjs-2';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    marginBottom: theme.spacing(6),
    padding: '30px 40px 30px 10px',
  },
}))

const options = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: true
        },
        stacked: true
      }
    ],
    yAxes: [
      {
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        gridLines: {
          display: true
        },
        labels: {
          show: true
        },
        stacked: true
      }
    ]
  },
  legend: {
    position: 'bottom'
  }
};

export default function Chart(props) {
  const {data} = props
  const classes = useStyles()

  return (
    <Paper className={classes.root}>
      <Bar
          data={data}
          options={options}
        />
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
