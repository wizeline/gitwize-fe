import React, { useEffect, useRef, useState, useContext } from 'react'
import { useOktaAuth } from '@okta/okta-react'
import PageTitle from '../components/PageTitle'
import { Grid, List, ListItem, ListItemText } from '@material-ui/core'
import { makeStyles, styled } from '@material-ui/core/styles'
import Chart, {chartTypeEnum} from '../components/Chart'
import { ApiClient } from '../apis'
import MainLayoutContex from '../contexts/MainLayoutContext'
import {
  calculateDateRangeQuarterlyTrendsAndCodeChangeVelocity
} from '../utils/dateUtils'
import { calculateHightLightState, calculateChartData} from '../utils/dataUtils'
import 'chartjs-plugin-datalabels'
import {
  buildCustomToolTipQuarterlyTrendAndCodeChangeVelocity,
  buildCustomPluginQuarterlyTrendsAndCodeChangeVelocity } from '../utils/chartUtils'

const apiClient = new ApiClient()

const useStyles = makeStyles(() => ({
  root: {
    justifyContent: 'space-between',
    marginBottom: '1vw',
    marginTop: 40,
  },
  gridItem: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  headerTxt: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  hightLightNumber: {
    fontSize: 65,
    fontWeight: 'bold',
  },
  highLightTypeName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  highLightTime: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  descriptonTxt: {
    fontSize: 12,
    color: '#6A707E',
    opacity: 0.6,
  },
}))

const ChartToolTip = styled('div')(({
  theme
}) => ({
  "&": {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 1)',
    color: 'white',
    borderRadius: '3px',
    fontFamily: 'Poppins',
    pointerEvents: 'none'
  },  
  "& li span": {
    width: '12px',
    height: '12px',
    display: 'inline-block',
    margin: '0 0.5vw 8px 0.5vw',
    verticalAlign: '-9.4px'
  },
  "& ul": {
    display: 'flex',
    justifyContent: 'center',
    listStyle: 'none',
    fontSize: '10px',
    flexDirection: 'column',
    padding: '0px',
  },
  "& li": {
    textAlign: 'left',
    height: '20px',
    fontWeight: 'bold',
    margin: '1vh 0.5vh',
  },
  "& li div": {
    float: 'right',
    margin: '0px 1vw'
  }
}))

const chartItems = [
  { name: 'Number of commits', color: '#62C8BA', fieldName: 'commits', unit: ''},
  { name: 'Additions', color: '#9F55E2', fieldName: 'additions', unit: ''},
  { name: 'Deletions', color: '#EC5D5C', fieldName: 'deletions', unit: '' },
]
const information = `This section will show the following code change trends over last 3 months, in terms of percentage increase/decrease with respect to the first month
\n- Number of commits
\n- Additions in lines of code
\n- Deletions in lines of code`
const dateRange = calculateDateRangeQuarterlyTrendsAndCodeChangeVelocity()

function CodeChangeVelocity(props) {
  const {pageTitle} = props
  const [hightLightState, setHightLightState] = useState({})
  const [chartData, setChartData] = useState()
  const [responseData, setResponseData] = useState()
  const { authService } = useOktaAuth()
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params
  const classes = useStyles()
  const dateFrom = dateRange.date_from
  const dateTo = dateRange.date_to

  const customToolTip = (tooltipModel, chartRef) => {
    buildCustomToolTipQuarterlyTrendAndCodeChangeVelocity(tooltipModel, chartRef, chartItems, responseData, dateFrom, dateTo)
  }

  const chartOptions = {
    scales: {
      xAxes: [
        {
          position: 'top',
          display: true,
          gridLines: {
            display: true,
            lineWidth: 1,
            drawTicks: false,
            zeroLineWidth: 0.5,
            drawBorder: false,
          },
          stacked: true,
          ticks: {
            fontColor: '#C4C4C4',
            fontSize: 10,
            padding: 10,
          },
        },
      ],
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-1',
          gridLines: {
            display: true,
            lineWidth: 0,
            drawTicks: false,
            drawOnChartArea: true,
            zeroLineWidth: 1,
          },
          labels: {
            show: true,
          },
          stacked: false,
          ticks: {
            fontColor: '#C4C4C4',
            fontSize: 10,
            precision: 0,
            suggestedMax: 50,
            suggestedMin: -50,
            padding: 10,
          },
        },
      ],
    },
    tooltips: {
      mode: 'label',
      enabled: false,
    },
    maintainAspectRatio: false,
  }

  const customPlugins = buildCustomPluginQuarterlyTrendsAndCodeChangeVelocity(chartData)

  useEffect(() => {
    apiClient.setAuthService(authService)
    mainLayout.current.handleChangeRepositoryId(id)
    apiClient.codeChangeVelocity.getCodeChangeVelocityStats(id, dateRange).then((data) => {
      setHightLightState(calculateHightLightState(data, dateFrom, dateTo, chartItems))
      const dataArrays = chartItems.map((chartItem) => calculateChartData(data, chartItem, dateFrom, dateTo))
      if (dataArrays.length > 0) {
        const dataSets = dataArrays.flatMap((item) => item.chartItemResult)
        const labels = dataArrays[0].labels
        setChartData({ datasets: dataSets, labels: labels })
        setResponseData(data)
      }
    })
  }, [id, dateFrom, dateTo, authService])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>{pageTitle}</PageTitle>
      <Grid container className={classes.root}>
        <Grid className={classes.gridItem} style={{ justifyContent: 'flex-start' }} item xs={4}>
          <List>
            <ListItem>
              <ListItemText disableTypography className={classes.headerTxt}>{hightLightState.highLightHeader}</ListItemText>
            </ListItem>
            {hightLightState.hightLightNumber && 
            <ListItem>
              <ListItemText disableTypography className={classes.hightLightNumber}>{hightLightState.hightLightNumber}</ListItemText>
            </ListItem>
            }
            {hightLightState.highLightTypeName && 
            <ListItem>
              <ListItemText disableTypography className={classes.highLightTypeName} style={{color: hightLightState.highLightColor}}>{hightLightState.highLightTypeName}</ListItemText>
            </ListItem>
            }
            {hightLightState.highLightTime && 
            <ListItem>
              <ListItemText disableTypography className={classes.highLightTime}>{hightLightState.highLightTime}</ListItemText>
            </ListItem>
            }
            <ListItem>
              <ListItemText disableTypography className={classes.descriptonTxt}>{hightLightState.descriptonTxt}</ListItemText>
            </ListItem>
          </List>
        </Grid>
        <Grid className={classes.gridItem} style={{ justifyContent: 'flex-start' }} item xs={8}>
          <Grid container >
            <Grid className={classes.gridItem} item xs={12}>
              <Chart
                chartType={chartTypeEnum.LINE}
                data={chartData}
                chartOptions={chartOptions}
                customToolTip={customToolTip}
                customPlugins={customPlugins}
              />
              <ChartToolTip id={'chartjs-tooltip'} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default CodeChangeVelocity
