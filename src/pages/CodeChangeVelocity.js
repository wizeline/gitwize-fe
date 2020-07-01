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
  if(chartData) {
    const chartValue = Object.values(chartData)
    const maxValue = chartValue.reduce((a, b) => {
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
}

const transformChartData = (data, chartBar) => {
  if(data) {
    const labels = Object.keys(data);
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

const chartBars = [
                    {name:'Number Of commit', color: '#62C8BA', fieldName: 'commits', chartId: 'chartLegendId-1'},
                    {name:'New Code Percentage', color: '#EC5D5C', fieldName: 'newCodeChanges', chartId: 'chartLegendId-2'},
                    {name:'Net Changes', color: '#9F55E2',fieldName: 'netChanges', chartId: 'chartLegendId-3'}, 
                  ]
const chartLines = []
const information = "This section will show the trends related to code changes over the last 3 months"

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
  const [responseData, setResponseData] = useState({})
  const { authState } = useOktaAuth()
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params
  const classes = useStyles();

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    mainLayout.current.handleChangeRepositoryId(id)
    const dateRange  = calculatedateRange()
    apiClient.codeChangeVelocity.getCodeChangeVelocityStats(id, dateRange).then((data) => {
      setResponseData(data)
      console.log(data, transformChartData(data, 'commits'))
    })
  }, [id, authState.accessToken])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Code Change Velocity</PageTitle>
      <Grid container className={classes.root}>
        <Grid className={classes.gridItem} style={{justifyContent: 'flex-end'}} item xs={12}>
            <Grid container className={classes.root}>
              {chartBars.map(chartItem => {
                return (<Grid key={chartItem.chartId} className={classes.gridItem} item xs={4}>
                          <Chart data={transformChartData(responseData[chartItem.fieldName], chartItem)} chartOptions={buildChartOptionsBasedOnMaxValue(responseData[chartItem.fieldName])} chartBars={chartBars} chartLines={chartLines} chartLegendId={chartItem.chartId}/>
                        </Grid>)
              })}
            </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default CodeChangeVelocity
