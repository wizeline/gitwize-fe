import React, {useEffect, useRef, useState, useContext} from 'react'
import { useOktaAuth } from '@okta/okta-react'
import PageTitle from '../components/PageTitle'
import { Grid, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import Chart from '../components/Chart'
import { ApiClient } from '../apis'
import MainLayoutContex from '../contexts/MainLayoutContext'
import {getStartOfMonth, getCurrentDate, getEndOfMonth, getNumberOfMonthBackward} from '../utils/dateUtils'
import {buildChartOptionsBasedOnMaxValue} from '../utils/chartUtils'
import {transformChartDataWithValueAbove, calculateHightLightState} from '../utils/dataUtils'
import 'chartjs-plugin-datalabels';

const apiClient = new ApiClient()

const useStyles = makeStyles(() => ({
  root: {
    justifyContent: 'space-between',
    marginBottom: '1vw',
    marginTop: 40
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center'
  },
  hightLightNumber: {
    fontSize: 65,
    fontWeight: 'bold',
    lineHeight: 97
  },
  highLightTypeName: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 33
  },
  highLightTime: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 19
  },
  descriptonTxt: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6A707E',
    opacity: 0.6
  }
}))

const chartBars = [
                    {name:'Number of commits', color: '#62C8BA', fieldName: 'commits', chartId: 'chartLegendId-1'},
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
  const [hightLightState, setHightLightState] = useState({hightLightNumber:'',highLightTypeName:'', 
                                                          highLightTime: '', descriptonTxt:''})
  const { authState, authService } = useOktaAuth()
  const tokenManager = authService.getTokenManager()
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params
  const classes = useStyles();
  const dateFrom = dateRange.date_from
  const dateTo = dateRange.date_to

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    apiClient.setTokenManager(tokenManager)
    mainLayout.current.handleChangeRepositoryId(id)
    apiClient.codeChangeVelocity.getCodeChangeVelocityStats(id, dateRange).then((data) => {
      setHightLightState(calculateHightLightState(data, dateFrom, dateTo, chartBars))
      setResponseData(data)
    })
  }, [id, authState.accessToken, dateFrom, dateTo, tokenManager])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Code Change Velocity</PageTitle>
      <Grid container className={classes.root}>
        <Grid className={classes.gridItem} style={{justifyContent: 'flex-end'}} item xs={4}>
          <List>
            <ListItem>
              <ListItemText className={classes.hightLightNumber}>{hightLightState.hightLightNumber}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText className={classes.highLightTypeName}>{hightLightState.highLightTypeName}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText className={classes.highLightTime}>{hightLightState.highLightTime}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText className={classes.descriptonTxt}>{hightLightState.descriptonTxt}</ListItemText>
            </ListItem>
          </List>
        </Grid>
        <Grid className={classes.gridItem} style={{justifyContent: 'flex-end'}} item xs={8}>
            <Grid container className={classes.root}>
              {chartBars.map(chartItem => {
                return (<Grid key={chartItem.chartId} className={classes.gridItem} item xs={6}>
                          <Chart isLegendClickable = {false} data={transformChartDataWithValueAbove(responseData[chartItem.fieldName], chartItem, dateFrom , dateTo)}
                            chartOptions={buildChartOptionsBasedOnMaxValue(responseData[chartItem.fieldName])}
                            chartBars={chartBars} chartLines={chartLines} chartLegendId={chartItem.chartId}/>
                        </Grid>)
              })}
            </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default CodeChangeVelocity
