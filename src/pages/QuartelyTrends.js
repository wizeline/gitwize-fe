import React, { useEffect, useRef, useState, useContext } from 'react'
import { useOktaAuth } from '@okta/okta-react'
import PageTitle from '../components/PageTitle'
import { Grid, List, ListItem, ListItemText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Chart from '../components/Chart'
import { ApiClient } from '../apis'
import MainLayoutContex from '../contexts/MainLayoutContext'
import {
  getStartOfMonth,
  getCurrentDate,
  getEndOfMonth,
  getNumberOfMonthBackward,
  getMonthNumberFromMonthName,
} from '../utils/dateUtils'
import { calculateHightLightState, calculateChartData, createChartFullData } from '../utils/dataUtils'
import 'chartjs-plugin-datalabels'
import { chartTypeEnum } from '../utils/chartUtils'
import styled from 'styled-components'

const apiClient = new ApiClient()

const useStyles = makeStyles(() => ({
  root: {
    justifyContent: 'space-between',
    marginBottom: '1vw',
    marginTop: 40,
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center',
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

const ChartToolTip = styled.div`
  & {
    position: absolute;
    background: rgba(0, 0, 0, 1);
    color: white;
    border-radius: 3px;
    font-family: Poppins;
    pointer-events: none;
  }

  li span {
    width: 12px;
    height: 12px;
    display: inline-block;
    margin: 0 0.5vw 8px 0.5vw;
    vertical-align: -9.4px;
  }
  ul {
    display: flex;
    justify-content: center;
    list-style: none;
    font-size: 10px;
    flex-direction: column;
    padding: 0px;
  }
  li {
    text-align: left;
    height: 20px;
    font-weight: bold;
    margin: 1vh 0.5vh;
  }
  li div {
    float: right;
    margin: 0px 1vw;
  }
`

const chartItems = [
  { name: 'Average PR size', color: '#62C8BA', fieldName: 'averagePRSize', unit: ''},
  { name: 'Average PR review time', color: '#EC5D5C', fieldName: 'averagePRTime', unit: 'mins'},
  { name: '% of Rejected PRs', color: '#9F55E2', fieldName: 'percentageRejectedPR', unit: '%' },
]
const information = 'This section will show PR related trends over the last 3 months'

const calculateDateRange = () => {
  const currentDate = getCurrentDate()
  const twoMonthsBackward = getNumberOfMonthBackward(currentDate, 2)
  const endOfCurrentMonth = getEndOfMonth(currentDate)
  const startOfMonthFrom = getStartOfMonth(twoMonthsBackward)
  return {
    date_from: startOfMonthFrom.unix(),
    date_to: endOfCurrentMonth.unix(),
  }
}

const dateRange = calculateDateRange()

function QuartelyTrends(props) {
  const { authService } = useOktaAuth()
  const [hightLightState, setHightLightState] = useState({})
  const [chartData, setChartData] = useState()
  const [responseData, setResponseData] = useState()
  const tokenManager = authService.getTokenManager()
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params
  const classes = useStyles()
  const dateFrom = dateRange.date_from
  const dateTo = dateRange.date_to

  const customToolTip = (tooltipModel, chartRef) => {
    // Tooltip Element
    var tooltipEl = document.getElementById('chartjs-tooltip')
    const chartInstance = chartRef.current.chartInstance

    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = document.createElement('div')
      tooltipEl.id = 'chartjs-tooltip'
      document.body.appendChild(tooltipEl)
    }

    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = 0
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
      var titleLines = tooltipModel.title || []
      var bodyLines = tooltipModel.body.map((bodyItem) => bodyItem.lines)

      if (bodyLines.length > 0) {
        tooltipEl.innerHTML = '<ul></ul>'
        let innerHtml = ''

        titleLines.forEach((title) => {
          innerHtml += '<li style="font-size: 14px">' + title + '</li>'
        })

        const tooltipItems = tooltipModel.dataPoints
        const dataSets = chartInstance.data.datasets

        //find missing data set Index:
        for (let i = 0; i < dataSets.length; i++) {
          const tooltipIndex = tooltipItems.findIndex((item) => item.datasetIndex === i)
          let style = 'background:'
          let body

          const chartItem = chartItems[i]
          const chartRawData = responseData[chartItem.fieldName]
          const rawDataKeys = Object.keys(chartRawData)
          const monthArrays = getMonthNumberFromMonthName(rawDataKeys)
          const chartFullData = createChartFullData(chartRawData, dateFrom, dateTo, monthArrays)

          if (tooltipIndex === -1) {
            style += chartItem.color
            style += '; border-color:' + chartItem.color
            body = `${chartItems[i].name}: <div>0</div>`
          } else {
            const colors = tooltipModel.labelColors[tooltipIndex]
            style += colors.backgroundColor
            style += '; border-color:' + colors.borderColor
            body = `${chartItems[i].name}: <div>${chartFullData.chartData[tooltipItems[0].index]} ${chartItem.unit}</div>`
          }

          style += '; border-width: 2px'
          innerHtml += `<li>
                        <span style="${style}"></span>${body}
                      </li>`
        }

        // bodyLines.forEach((body, i) => {
        //   var colors = tooltipModel.labelColors[i]
        //   var style = 'background:' + colors.backgroundColor
        //   style += '; border-color:' + colors.borderColor
        //   style += '; border-width: 2px'
        //   innerHtml += `<li>
        //                   <span style="${style}"></span>${body}
        //                 </li>`
        // })

        var tableRoot = tooltipEl.querySelector('ul')
        tableRoot.innerHTML = innerHtml
      }

      // `this` will be the overall tooltip
      var position = chartInstance.canvas.getBoundingClientRect()

      // Display, position, and set styles for font
      tooltipEl.style.opacity = 0.9
      let left = position.left + window.pageXOffset + tooltipModel.caretX
      tooltipEl.style.left =
        left + tooltipEl.offsetWidth > window.innerWidth ? left - tooltipEl.offsetWidth + 'px' : left + 'px'
      tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'
      tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
      tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
    }
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

  const customPlugins = [
    {
      afterDraw: (chartInstance, easing) => {
        const ctx = chartInstance.chart.ctx
        ctx.font = '9px Poppins'
        ctx.fillStyle = "#6A707E"
        if(chartData) {
          const data = chartData.datasets.flatMap(dataSet => dataSet.data)
          const index = data.findIndex((item, i) => {
            return (i%3 === 0 && item !== undefined)
          })
          if(index === -1) {
            ctx.wrapText(`There was no activity for the month of ${chartData.labels[0]}`, 40, ctx.canvas.offsetHeight/2, ctx.canvas.offsetWidth/4, 20)
          }
        }
      },
    },
  ]

  useEffect(() => {
    apiClient.setTokenManager(tokenManager)
    mainLayout.current.handleChangeRepositoryId(id)
    apiClient.quarterlyTrends.getQuarterlyTrendsStats(id, dateRange).then((data) => {
      setHightLightState(calculateHightLightState(data, dateFrom, dateTo, chartItems))
      const dataArrays = chartItems.map((chartItem) => calculateChartData(data, chartItem, dateFrom, dateTo))
      if (dataArrays.length > 0) {
        const dataSets = dataArrays.flatMap((item) => item.chartItemResult)
        const labels = dataArrays[0].labels
        setChartData({ datasets: dataSets, labels: labels })
        setResponseData(data)
      }
    })
  }, [id, dateFrom, dateTo, tokenManager])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Quarterly Trends</PageTitle>
      <Grid container className={classes.root}>
        <Grid className={classes.gridItem} style={{ justifyContent: 'flex-end' }} item xs={4}>
          <List>
            <ListItem>
              <ListItemText disableTypography className={classes.headerTxt}>{hightLightState.highLightHeader}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography className={classes.hightLightNumber}>{hightLightState.hightLightNumber}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography className={classes.highLightTypeName}>{hightLightState.highLightTypeName}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography className={classes.highLightTime}>{hightLightState.highLightTime}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography className={classes.descriptonTxt}>{hightLightState.descriptonTxt}</ListItemText>
            </ListItem>
          </List>
        </Grid>
        <Grid className={classes.gridItem} style={{ justifyContent: 'flex-end' }} item xs={8}>
          <Grid container className={classes.root}>
            <Grid className={classes.gridItem} item xs={12}>
              <Chart
                chartType={chartTypeEnum.LINE}
                data={chartData}
                chartOptions={chartOptions}
                chartBars={chartItems}
                isNeedReDrawOptions={false}
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

export default QuartelyTrends
