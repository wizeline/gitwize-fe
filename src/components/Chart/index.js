import React from 'react'
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

export default function Chart(props) {
  const {data, chartOptions} = props
  const classes = useStyles()
  let chart;
  if(data && data.length !== 0) {
    chart  = (<Bar
                data={data}
                options={chartOptions}
              />)
  } 

  return (
    <Paper className={classes.root}>
        {chart}
    </Paper>
  )
}
