import React, {useEffect, useRef, useState, useContext} from 'react'
import { useOktaAuth } from '@okta/okta-react'
import PageTitle from '../components/PageTitle'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import Chart from '../components/Chart'
import { ApiClient } from '../apis'
import MainLayoutContex from '../contexts/MainLayoutContext'
import {getStartOfMonth, getCurrentDate, getEndOfMonth, getNumberOfMonthBackward, getMonthFromDate} from '../utils/dateUtils'
import {buildChartOptionsBasedOnMaxValue} from '../utils/chartUtils'
import {transformChartDataWithValueAbove} from '../utils/dataUtils'
import 'chartjs-plugin-datalabels';

const apiClient = new ApiClient()

const useStyles = makeStyles(() => ({
  root: {
    justifyContent: 'space-between',
    marginBottom: '1vw',
    marginTop: 60
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center'
  }
}))

const chartBars = [
                    {name:'Average PR size', color: '#62C8BA', fieldName: 'averagePRSize', chartId: 'chartLegendId-1'},
                    {name:'Average PR review time', color: '#EC5D5C', fieldName: 'averagePRTime', chartId: 'chartLegendId-2'},
                    {name:'Rejected PRs', color: '#9F55E2',fieldName: 'percentageRejectedPR', chartId: 'chartLegendId-3'}, 
                  ]
const chartLines = []
const information = "This section will show the trends related to code changes over the last 3 months"

const calculateDateRange = () => {
  const currentDate = getCurrentDate()
  const twoMonthsBackward = getNumberOfMonthBackward(currentDate, 2)
  const endOfCurrentMonth = getEndOfMonth(currentDate)
  const startOfMonthFrom = getStartOfMonth(twoMonthsBackward)
  return {
    date_from: startOfMonthFrom.unix(),
    date_to: endOfCurrentMonth.unix()
  }
}

const customFormatter = (value, context) => {
  const {dataIndex, dataset} = context
  if(dataIndex === 0) {
    return ''
  } else {
    return (value - dataset.data[dataIndex - 1]) + '%'
  }
}

const dateRange  = calculateDateRange()

function QuartelyTrends(props) {
  const [responseData, setResponseData] = useState({})
  const { authState } = useOktaAuth()
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params
  const classes = useStyles();

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    mainLayout.current.handleChangeRepositoryId(id)
    apiClient.quarterlyTrends.getQuarterlyTrendsStats(id, dateRange).then((data) => {
      setResponseData(data)
    })
  }, [id, authState.accessToken])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Quarterly Trends</PageTitle>
      <Grid container className={classes.root}>
        <Grid className={classes.gridItem} style={{justifyContent: 'flex-end'}} item xs={12}>
            <Grid container className={classes.root}>
              {chartBars.map(chartItem => {
                const data = chartItem.fieldName === 'percentageRejectedPR' 
                ? transformChartDataWithValueAbove(responseData[chartItem.fieldName], chartItem, getMonthFromDate(dateRange.date_from * 1000), 
                  getMonthFromDate(dateRange.date_to * 1000), customFormatter) 
                : transformChartDataWithValueAbove(responseData[chartItem.fieldName], chartItem, getMonthFromDate(dateRange.date_from * 1000)
                  , getMonthFromDate(dateRange.date_to * 1000))
                return (<Grid key={chartItem.chartId} className={classes.gridItem} item xs={4}>
                          <Chart data={data} chartOptions={buildChartOptionsBasedOnMaxValue(responseData[chartItem.fieldName])} chartBars={chartBars} chartLines={chartLines} chartLegendId={chartItem.chartId}/>
                        </Grid>)
              })}
            </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default QuartelyTrends
