import React, { useState, useEffect, useContext, useRef } from 'react'
import { makeStyles,styled } from '@material-ui/core/styles'
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
    enabled: false,
  },
  maintainAspectRatio: false,
}

const BubbleChartToolTip = styled('div')(({
  theme
}) => ({
  "&": {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 1)',
    color: 'white',
    borderRadius: '3px',
    fontFamily: 'Poppins',
    pointerEvents: 'auto',
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
    fontSize: 10,
    textAlign: 'left',
    height: '20px',
    fontWeight: 'bold',
    margin: '1vh 0.5vw',
    color: "#CACACA"
  },
  "& li div": {
    float: 'right',
    margin: '0px 1vw 0px 5vw',
    color: 'white',
    fontWeight: 'bolder'
  },
  "& li.title": {
    fontSize: "16px",
    color: 'white',
    fontWeight: 'bold'
  },
  "& .toolTipButton": {
    width: '100%',
    height: '37px',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.09);',
    borderRadius: 8,
    color: '#FFFFFF'
  },
  "&.nothover:not(:hover)": {
    display: 'none'
  }
}))

const handleClickButton = (e, item, index) => {
  console.log(index)
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

  const bubbleCustomToolTip = (tooltipModel, chartRef) => {
    // Tooltip Element
  let tooltipEl = document.getElementById('chartjs-tooltip-1')
  const chartInstance = chartRef.current.chartInstance
  // Create element on first render
  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.id = 'chartjs-tooltip'
    document.body.appendChild(tooltipEl)
  }
  // Hide if no tooltip
  tooltipEl.classList.remove('nothover')
  if (tooltipModel.opacity === 0) {
    tooltipEl.classList.add('nothover')
    tooltipEl.style.opacity = null
    return
  }
  // Set caret Position
  tooltipEl.classList.remove('above', 'below', 'no-transform')
  if (tooltipModel.yAlign) {
    tooltipEl.classList.add(tooltipModel.yAlign)
  } else {
    tooltipEl.classList.add('no-transform')
  }
  // Set Text
  if (tooltipModel.body) {
    let bodyLines = tooltipModel.body.map((bodyItem) => bodyItem.lines)
    if (bodyLines.length > 0) {
      tooltipEl.innerHTML = '<ul></ul>'
      let innerHtml = ''
      const tooltipItems = tooltipModel.dataPoints
      const dataSets = chartInstance.data.datasets
      const index = tooltipItems[0].index
      const fullData = dataSets[0].data[index]
      //find missing data set Index:
      innerHtml += `
                  <li class="title"> ${fullData.prTitle} </li>
                  <li>
                      PR Creation Date: <div> ${fullData.creationDate} </div>
                  </li>
                  <li>
                      PR Size: <div> ${fullData.PRSize} </div>
                  </li>
                  <li>
                      Status of PR: <div> ${fullData.statusOfPr} </div>
                  </li>
                  <li>
                      PR Review Time: <div> ${fullData.PRReviewTime} </div>
                  </li>
                  <li>
                      Created by <div> ${fullData.createdBy} </div>
                  </li>
                  <li><button class="toolTipButton">View PR</button></li>`
      let tableRoot = tooltipEl.querySelector('ul')
      tableRoot.innerHTML = innerHtml
    }
    document.querySelectorAll(`.toolTipButton`).forEach((item, index) => {
      item.addEventListener("click", e => handleClickButton(e, item, index));
    })
    // `this` will be the overall tooltip
    let position = chartInstance.canvas.getBoundingClientRect()
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 0.9
    let left = position.left + window.pageXOffset + tooltipModel.caretX
    tooltipEl.style.left =
    left + tooltipEl.offsetWidth > window.innerWidth ? left - tooltipEl.offsetWidth + 'px' : left + 'px'
    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.y + 'px'
    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
    }
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
      <PageTitle information={information}>Pull request size</PageTitle>
      <BranchFilter showDate={showDate} onPeriodChange={(headerText) => handleChangeHeaderTxt(headerText)} />
      <Paper className={classes.textStyle} elevation={0} square={true} variant="elevation">
        {headerTxt}
      </Paper>
      <Chart chartType={chartTypeEnum.BUBBLE} data={chartData} chartOptions={chartOptions} isLegendDisabled={true} 
         customToolTip={bubbleCustomToolTip}/>
      <BubbleChartToolTip id="chartjs-tooltip-1"/>
    </div>
  )
}

export default PullRequestSize
