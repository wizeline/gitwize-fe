import React, {useEffect, useRef, useState, useContext} from 'react'
import { useOktaAuth } from '@okta/okta-react'
import PageTitle from '../components/PageTitle'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import Chart from '../components/Chart'
import { ApiClient } from '../apis'
import MainLayoutContex from '../contexts/MainLayoutContext'
import {getStartOfMonth, getCurrentDate, getEndOfMonth, getNumberOfMonthBackward, getMonth} from '../utils/dateUtils'
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
                    {name:'Number of commits', color: '#62C8BA', fieldName: 'commits', chartId: 'chartLegendId-1'},
                    // {name:'New Code Percentage', color: '#EC5D5C', fieldName: 'newCodeChanges', chartId: 'chartLegendId-2'},
                    {name:'Net changes', color: '#9F55E2',fieldName: 'netChanges', chartId: 'chartLegendId-3'}, 
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

const dateRange  = calculateDateRange()

function CodeChangeVelocity(props) {
  const [responseData, setResponseData] = useState({})
  const { authState } = useOktaAuth()
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params
  const classes = useStyles();

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    mainLayout.current.handleChangeRepositoryId(id)
    apiClient.codeChangeVelocity.getCodeChangeVelocityStats(id, dateRange).then((data) => {
      setResponseData(data)
    })
  }, [id, authState.accessToken])

  const monthFrom = getMonth(dateRange.date_from * 1000)
  const monthTo = getMonth(dateRange.date_to * 1000)
  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Code Change Velocity</PageTitle>
      <Grid container className={classes.root}>
        <Grid className={classes.gridItem} style={{justifyContent: 'flex-end'}} item xs={12}>
            <Grid container className={classes.root}>
              {chartBars.map(chartItem => {
                return (<Grid key={chartItem.chartId} className={classes.gridItem} item xs={4}>
                          <Chart data={transformChartDataWithValueAbove(responseData[chartItem.fieldName], chartItem, monthFrom , monthTo)} 
                          chartOptions={buildChartOptionsBasedOnMaxValue(responseData[chartItem.fieldName])} chartBars={chartBars} chartLines={chartLines} chartLegendId={chartItem.chartId}/>
                        </Grid>)
              })}
            </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default CodeChangeVelocity
