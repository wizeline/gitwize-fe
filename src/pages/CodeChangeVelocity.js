import React, {useEffect, useRef, useState, useContext} from 'react'
import { useOktaAuth } from '@okta/okta-react'
import PageTitle from '../components/PageTitle'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import Chart from '../components/Chart'
import { ApiClient } from '../apis'
import MainLayoutContex from '../contexts/MainLayoutContext'
import {getStartOfMonth, getCurrentDate, getEndOfMonth, getNumberOfMonthBackward} from '../utils/dateUtils'
import 'chartjs-plugin-datalabels';

const apiClient = new ApiClient()
const moreValueToAddYAxis = 10

const useStyles = makeStyles(() => ({
  root: {
    justifyContent: 'space-between',
    marginBottom: '1vw',
    marginTop: 60
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    flexGrow: 0.3,
    fontWeight: 'bold',
    borderRadius: '8px',
    fontSize: '13px'
  },
  textStyle: {
    float: 'left',
    fontSize: '18px',
    fontWeight: '700',
    backgroundColor: 'transparent'
  }
}))

const buildChartOptionsBasedOnMaxValue = (chartData) => {
  const maxValue = chartData.reduce((a, b) => {
    return Math.max(a, b);
  })
  return  {
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            display: false
          },
          stacked: false,
          ticks: {
            fontColor: "#C4C4C4",
            fontSize: 10,
            autoSkip: true,
            autoSkipPadding: 30
          }
        }
      ],
      yAxes: [
        {
          type: 'linear',
          display: false,
          position: 'left',
          id: 'y-axis-1',
          gridLines: {
            display: false
          },
          labels: {
            show: false
          },
          stacked: false,
          ticks: {
            fontColor: "#C4C4C4",
            fontSize: 10,
            beginAtZero: true,
            min: 0,
            max: (maxValue + moreValueToAddYAxis),
            precision: 0,
            suggestedMax: 5
          }
        }
      ]
    },
    tooltips: {
      enabled: false
    },
    plugins: {
      datalabels: {
          anchor: 'end',
          align: 'right',
          offset: 20,
          font: {
            size: 14
          }
      }
    },
    maintainAspectRatio: false,
  }
}

const transformChartData = (response, chartBars, fieldName) => {
  const chartBar = chartBars[0]
  const data = response[fieldName]
  if(data) {
    const labels = Object.keys(chartData);
    const chartData = []
    labels.forEach(item => {
      chartData.push(data[item])
    })
    const dataSets = [
      {
        label: chartBar.name,
        backgroundColor: chartBar.color,
        borderColor: chartBar.color,
        hoverBackgroundColor: chartBar.color,
        borderWidth: 1,
        data: chartData,
        barPercentage: 0.7,
        categoryPercentage:  0.5,
        datalabels: {
          color: chartBar.color,
          font: {
            weight: 'bold'
          },
          formatter: function (value, context) {
            const {dataIndex, dataset} = context
            if(dataIndex === 0) {
              return ''
            } else {
              value = Math.round(((value - dataset.data[dataIndex - 1]) / dataset.data[dataIndex - 1]) * 100)
              return value + '%'
            }
          }
        }
      },
    ]
    return {
      labels: labels,
      datasets: dataSets
    }
  }
}

const chartBarNumberOfCommits = [{name:'Number Of commit', color: '#62C8BA'}]
const chartBarNetChanges = [{name:'Net Changes', color: '#9F55E2'}]
const chartBarNewCode = [{name:'New Code Percentage', color: '#EC5D5C'}]
const chartLines = []
const chartDataNumberOfCommit = {
  labels: [
  'March',
  'April',
  'May'
  ],
  datasets: [
    {
      label: "Number Of commit",
      backgroundColor: "#62C8BA",
      borderColor: "#62C8BA",
      hoverBackgroundColor: "#62C8BA",
      borderWidth: 1,
      data: [121, 221, 32],
      barPercentage: 0.7,
      categoryPercentage:  0.5,
      datalabels: {
        color: '#62C8BA',
        font: {
          weight: 'bold'
        },
        formatter: function (value, context) {
          const {dataIndex, dataset} = context
          if(dataIndex === 0) {
            return ''
          } else {
            value = Math.round(((value - dataset.data[dataIndex - 1]) / dataset.data[dataIndex - 1]) * 100)
            return value + '%'
          }
        }
      }
    },
  ]
}

const chartDataNewCodePercentage = {
  labels: [
  'March',
  'April',
  'May'
  ],
  datasets: [
    {
      label: "New Code Percentage",
      backgroundColor: "#EC5D5C",
      borderColor: "#EC5D5C",
      hoverBackgroundColor: "#EC5D5C",
      borderWidth: 1,
      data: [111, 22, 33],
      barPercentage: 0.5,
      categoryPercentage:  0.7,
      datalabels: {
        color: '#EC5D5C',
        font: {
          weight: 'bold'
        },
        formatter: function (value, context) {
          const {dataIndex, dataset} = context
          if(dataIndex === 0) {
            return ''
          } else {
            value = Math.round(((value - dataset.data[dataIndex - 1]) / dataset.data[dataIndex - 1]) * 100)
            return value + '%'
          }
        }
      }
    }
  ]
}

const chartDataNetChange = {
  labels: [
  'March',
  'April',
  'May'
  ],
  datasets: [
    {
      label: "Net Changes",
      backgroundColor: "#9F55E2",
      borderColor: "#9F55E2",
      hoverBackgroundColor: "#9F55E2",
      borderWidth: 1,
      data: [12, 23, 35],
      barPercentage: 0.5,
      categoryPercentage:  0.7,
      datalabels: {
        color: '#9F55E2',
        font: {
          weight: 'bold'
        },
        formatter: function (value, context) {
          const {dataIndex, dataset} = context
          if(dataIndex === 0) {
            return ''
          } else {
            value = Math.round(((value - dataset.data[dataIndex - 1]) / dataset.data[dataIndex - 1]) * 100)
            return value + '%'
          }
        }
      }
    },
  ]
}

const calculatedateRange = () => {
  const currentDate = getCurrentDate()
  const twoMonthsBackward = getNumberOfMonthBackward(currentDate, 2)
  const endOfMothCurrentDate = getEndOfMonth(currentDate)
  const startOfMonthFrom = getStartOfMonth(twoMonthsBackward)
  return {
    date_from: new Date(startOfMonthFrom.unix()*1000),
    date_to: new Date(endOfMothCurrentDate.unix()*1000)
  }
}

function CodeChangeVelocity(props) {
  const {information} = props;
  const [chartData, setChartData] = useState()
  const { authState } = useOktaAuth()
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params
  const classes = useStyles();
  // const dateRange = calculatedateRange()

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    mainLayout.current.handleChangeRepositoryId(id)
    const dateRange  = calculatedateRange()
    apiClient.codeChangeVelocity.getCodeChangeVelocityStats(id, dateRange).then((data) => {
      console.log(data, transformChartData(data, 'commits'))
    })
  }, [id, authState.accessToken])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Code Change Velocity</PageTitle>
      <Grid container className={classes.root}>
        <Grid className={classes.gridItem} style={{justifyContent: 'flex-end'}} item xs={12}>
            <Grid container className={classes.root}>
              <Grid className={classes.gridItem} item xs={4}>
                  <Chart data={chartDataNumberOfCommit} chartOptions={buildChartOptionsBasedOnMaxValue(chartDataNumberOfCommit.datasets[0].data)} chartBars={chartBars} chartLines={chartLines} chartLegendId={'chartLegendId-1'}/>
              </Grid>
              <Grid className={classes.gridItem} item xs={4}>
                  <Chart data={chartDataNewCodePercentage} chartOptions={buildChartOptionsBasedOnMaxValue(chartDataNewCodePercentage.datasets[0].data)} chartBars={chartBars} chartLines={chartLines} chartLegendId={'chartLegendId-2'}/>
              </Grid>
              <Grid className={classes.gridItem} item xs={4}>
                  <Chart data={chartDataNetChange} chartOptions={buildChartOptionsBasedOnMaxValue(chartDataNetChange.datasets[0].data)} chartBars={chartBars} chartLines={chartLines} chartLegendId={'chartLegendId-3'}/>
              </Grid>
            </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default CodeChangeVelocity
