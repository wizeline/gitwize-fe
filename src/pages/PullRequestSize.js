import React, { useState, useEffect, useContext, useRef } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { useOktaAuth } from '@okta/okta-react'

import { ApiClient } from '../apis'
import { transformDataForBubbleChart } from '../utils/dataUtils'
import PageContext from '../contexts/PageContext'
import MainLayoutContex from '../contexts/MainLayoutContext'
import BranchFilter from '../components/BranchFilter'
import PageTitle from '../components/PageTitle'
import Chart, { chartTypeEnum } from '../components/Chart'
import { buildCustomToolTipPullRequestSize } from '../utils/chartUtils'

const apiClient = new ApiClient()
const showDate = ['Last 7 Days', 'Last 14 Days', 'Last 21 Days', 'Last 30 Days', 'Custom']
const information = `This section will display the size of all the PRs created in the selected date range in form of circles. 
  A bigger circle means a bigger PR. PRs with more than 300 lines of code are shown as red. 
  Every circle will have a tooltip which will show some details about the PR, and an actual link to the PR.`

const useStyles = makeStyles(() => ({
  root: {
    justifyContent: 'space-between',
    marginBottom: '1vw',
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    flexGrow: 0.3,
    fontWeight: 'bold',
    borderRadius: '8px',
    fontSize: '13px',
  },
  textStyle: {
    float: 'left',
    fontSize: '18px',
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
}))

const chartOptions = {
  layout: {
    padding: {
      left: 40,
      right: 45,
      top: 50,
    },
  },
  plugins: {
    datalabels: {
      display: false,
    },
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          parser: 'Do MMM',
          unit: 'day',
          displayFormats: {
            day: 'Do MMM',
          },
        },
        labels: {
          show: false,
          overflow: 'justify',
        },
        display: true,
        gridLines: {
          display: true,
          lineWidth: 1,
          drawTicks: false,
          zeroLineWidth: 0.5,
          drawBorder: false,
        },
        stacked: false,
        ticks: {
          fontColor: '#121212',
          fontSize: 10,
          padding: 30,
        },
      },
    ],
    yAxes: [
      {
        type: 'linear',
        display: false,
        position: 'left',
        id: 'y-axis-1',
        gridLines: {
          display: true,
          lineWidth: 0,
          drawTicks: false,
          drawOnChartArea: true,
          zeroLineWidth: 0,
        },
        labels: {
          show: false,
          overflow: 'justify',
        },
        stacked: false,
        ticks: {
          fontColor: '#C4C4C4',
          fontSize: 10,
          precision: 0,
          display: true,
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

const BubbleChartToolTip = styled('div')(({ theme }) => ({
  '&': {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    borderRadius: '3px',
    fontFamily: 'Poppins',
    pointerEvents: 'auto',
  },
  '& li span': {
    width: '12px',
    height: '12px',
    display: 'inline-block',
    margin: '0 0.5vw 8px 0.5vw',
    verticalAlign: '-9.4px',
  },
  '& ul': {
    display: 'flex',
    justifyContent: 'center',
    listStyle: 'none',
    fontSize: '14px',
    flexDirection: 'column',
    padding: '0px',
  },
  '& li': {
    fontSize: 10,
    textAlign: 'left',
    height: '20px',
    fontWeight: 'bold',
    margin: '1vh 0.5vw',
    color: '#CACACA',
  },
  '& li div': {
    float: 'right',
    margin: '0px 1vw 0px 5vw',
    color: 'white',
    fontWeight: 'bolder',
  },
  '& li.title': {
    fontSize: '16px',
    color: 'white',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  '& .toolTipButton': {
    width: '100%',
    height: '37px',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.09);',
    borderRadius: 8,
    color: '#FFFFFF',
    border: 'none',
  },
  '&.nothover:not(:hover)': {
    display: 'none',
  },
}))

function PullRequestSize(props) {
  const {pageTitle} = props
  const [headerTxt, setHeaderTxt] = useState(showDate[0])
  const [chartData, setChartData] = useState()
  const { authService } = useOktaAuth()
  const tokenManager = authService.getTokenManager()
  const [{ dateRange }] = useContext(PageContext)
  const classes = useStyles()
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params

  const customToolTip = (tooltipModel, chartRef) => {
    buildCustomToolTipPullRequestSize(tooltipModel, chartRef)
  }

  useEffect(() => {
    apiClient.setTokenManager(tokenManager)
    apiClient.pullRequestSize.getPullRequestSize(id, dateRange).then((data) => {
      mainLayout.current.handleChangeRepositoryId(id)
      const transformedData = transformDataForBubbleChart(data)
      setChartData(transformedData)
    })
  }, [tokenManager, dateRange, id, mainLayout])

  const handleChangeHeaderTxt = (headerText) => {
    setHeaderTxt(headerText)
  }

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>{pageTitle}</PageTitle>
      <BranchFilter showDate={showDate} onPeriodChange={(headerText) => handleChangeHeaderTxt(headerText)} />
      <Paper className={classes.textStyle} elevation={0} square={true} variant="elevation">
        {headerTxt}
      </Paper>
      <Chart
        chartType={chartTypeEnum.BUBBLE}
        data={chartData}
        chartOptions={chartOptions}
        isLegendDisabled={true}
        customToolTip={customToolTip}
      />
      <BubbleChartToolTip id="chartjs-tooltip-1" />
    </div>
  )
}

export default PullRequestSize
