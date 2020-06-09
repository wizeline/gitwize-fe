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
        stacked: true,
        ticks: {
          fontColor: "#C4C4C4",
          fontSize: 10
        }
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
        stacked: true,
        ticks: {
          fontColor: "#C4C4C4",
          fontSize: 10
        }
      },
      {
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-2',
        gridLines: {
          display: false
        },
        labels: {
          show: true
        },
        stacked: false,
        ticks: {
          fontColor: "#62C8BA",
          fontSize: 10
        }
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
  let chart;
  if(data && data.length !== 0) {
    chart  = (<Bar
                data={data}
                options={options}
              />)
  } 

  return (
    <Paper className={classes.root}>
        {chart}
    </Paper>
  )
}
