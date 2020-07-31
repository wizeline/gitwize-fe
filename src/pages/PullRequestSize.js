import React, { useState, useEffect, useContext, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { useOktaAuth } from '@okta/okta-react'

import { ApiClient } from '../apis'
import { transformDataForBubbleChart } from '../utils/dataUtils'
import PageContext from '../contexts/PageContext'
import MainLayoutContex from '../contexts/MainLayoutContext'
import BranchFilter from '../components/BranchFilter'
import PageTitle from '../components/PageTitle'
import Chart, { chartTypeEnum } from '../components/Chart'

const apiClient = new ApiClient()
const showDate = ['Last 7 Days', 'Last 14 Days', 'Last 21 Days', 'Last 30 Days', 'Custom']
const information = 'This section will display the pull request size'

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
          padding: 10,
        },
      },
    ],
    yAxes: [
      {
        type: 'linear',
        display: true,
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
          show: true,
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
    enabled: true,
  },
  maintainAspectRatio: false,
}

function PullRequestSize(props) {
  const [headerTxt, setHeaderTxt] = useState(showDate[0])
  const [chartData, setChartData] = useState()
  const { authService } = useOktaAuth()
  const tokenManager = authService.getTokenManager()
  const [{ dateRange }] = useContext(PageContext)
  const classes = useStyles()
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params

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
      <PageTitle information={information}>Pull request size</PageTitle>
      <BranchFilter showDate={showDate} onPeriodChange={(headerText) => handleChangeHeaderTxt(headerText)} />
      <Paper className={classes.textStyle} elevation={0} square={true} variant="elevation">
        {headerTxt}
      </Paper>
      <Chart chartType={chartTypeEnum.BUBBLE} data={chartData} chartOptions={chartOptions} isLegendDisabled={true} />
    </div>
  )
}

export default PullRequestSize
