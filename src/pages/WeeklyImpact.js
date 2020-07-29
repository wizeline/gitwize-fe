import React, { useEffect, useRef, useContext, useState } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import PageTitle from '../components/PageTitle'
import { makeStyles } from '@material-ui/core/styles'
import { ApiClient } from '../apis'
import MainLayoutContex from '../contexts/MainLayoutContext'
import { Grid, ListItemText } from '@material-ui/core'
import clsx from 'clsx'
import { buildGridItemsWeeklyImpact } from '../utils/dataUtils'
import { formatToMMDD } from '../utils/dateUtils'
import Chart, {chartTypeEnum} from '../components/Chart'
import { buildChartOptionsBasedOnMaxValue } from '../utils/chartUtils'
import styled from 'styled-components'

const information = `Impact measures the magnitude of code changes, and our inhouse formula takes into consideration more than just lines of code`
const IMPACT_SCORE_TXT = 'Impact score'
const gridItems = [
  { name: IMPACT_SCORE_TXT, fieldName: 'impactScore' },
  { name: 'Active days', fieldName: 'activeDays' },
  { name: 'Commits/day', fieldName: 'commitsPerDay' },
  { name: 'Most churned file', fieldName: 'mostChurnedFiles' },
]

const apiClient = new ApiClient()
const useStyles = makeStyles(() => ({
  root: {
    justifyContent: 'space-between',
    marginBottom: '1vw',
    marginTop: 31,
  },
  subContainer: {
    width: '100%',
    height: '33vh',
  },
  gridItem: {
    display: 'flex',
    alignItems: 'start',
  },
  highlightSubGridItem: {
    background: '#5392FF',
    borderRadius: 4,
    color: '#FFFFFF',
  },
  subGridItem: {
    paddingLeft: 34,
  },
  descriptionTxt: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6A707E',
  },
  itemNameTxt: {
    fontSize: 16,
    lineHeight: 24,
    color: '#C4C4C4',
    marginTop: '2vh',
  },
  itemValueTxt: {
    fontSize: 65,
    lineHeight: 97,
  },
  itemDiffValueTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 27,
    borderRadius: 7,
    width: '25%',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  itemPreviousTxt: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: '3vh',
    color: '#C4C4C4',
  },
  itemChurnedFileName: {
    fontSize: 14,
    lineHeight: 21,
    wordBreak: 'break-all',
  },
  itemLast: {
    alignSelf: 'flex-end',
    marginBottom: '2vh',
  },
  whiteFontTxt: {
    color: '#FFFFFF',
  },
  developmentFocusHeader: {
    fontSize: 24,
    fontWeight: 500,
  },
  developmentFocusDesc: {
    fontSize: 16,
    color: '#6A707E',
  },
}))

const chartItems = [
  { name: 'New Code', color: '#62C8BA', fieldName: 'newCodePercentage', chartLegendId: 'chart-legend-1' },
  { name: 'Churn', color: '#EC5D5C', fieldName: 'churnPercentage', chartLegendId: 'chart-legend-2' },
]

const ChartToolTip = styled.div`
  & {
    position: absolute;
    background: rgba(0, 0, 0, 1);
    color: white;
    border-radius: 10px;
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

const calculatePeriod = (period) => {
  const dateFrom = period.date_from
  const dateTo = period.date_to
  return {
    dateFrom: formatToMMDD(dateFrom),
    dateTo: formatToMMDD(dateTo),
  }
}

const calculateChartData = (data, chartItem) => {
  if (data) {
    const labels = [chartItem.name]
    const datasets = []
    const dataSetItem = {
      label: chartItem.name,
      data: [data.currentPeriod],
      borderColor: chartItem.color,
      backgroundColor: chartItem.color,
      barPercentage: 0.3,
      categoryPercentage: 0.9,
      datalabels: {
        display: true,
        color: chartItem.color,
        font: {
          weight: 'bold',
        },
      },
    }
    datasets.push(dataSetItem)
    return {
      labels: labels,
      datasets: datasets,
    }
  }
  return undefined
}

const customToolTip = (tooltipModel, chartRef) => {
  // Tooltip Element
  let tooltipEl = document.getElementById('chartjs-tooltip')
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
    let titleLines = tooltipModel.title || []
    let bodyLines = tooltipModel.body.map((bodyItem) => bodyItem.lines)

    if (bodyLines.length > 0) {
      tooltipEl.innerHTML = '<ul></ul>'
      let innerHtml = ''

      titleLines.forEach((title) => {
        innerHtml += '<li style="font-size: 14px">' + title + '</li>'
      })

      const tooltipItems = tooltipModel.dataPoints
      if (tooltipItems.length > 0) {
        let label
        switch (tooltipItems[0].label) {
          case 'Churn':
            label = 'What percentage of total changes is churn/refactoring'
            break
          case 'New Code':
            label = 'What percentage of total changes is new lines of code'
            break
          default:
            label = ''
        }
        innerHtml += `<li>
                      ${label}
                    </li>`
        let tableRoot = tooltipEl.querySelector('ul')
        tableRoot.innerHTML = innerHtml
      }
    }

    // `this` will be the overall tooltip
    let position = chartInstance.canvas.getBoundingClientRect()

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

const calculateFocusData = (response, chartItems) => {
  if(response) {
    let focusItemIndex = -1
    let maxValue = Number.MIN_SAFE_INTEGER
    chartItems.forEach((item, i) => {
      const value  = response[item.fieldName].currentPeriod;
      if(value > maxValue) {
        maxValue = value
        focusItemIndex = i
      }
    })
    if(focusItemIndex !== -1) {
      return chartItems[focusItemIndex].name
    }
    return ''
  }
}

function WeeklyImpact(props) {
  const {id} = props.match.params;
  const classes = useStyles();
  const { authService } = useOktaAuth()
  const tokenManager = authService.getTokenManager()
  const mainLayout = useRef(useContext(MainLayoutContex))
  const [gridItemsState, setGridItems] = useState([])
  const [response, setResponse] = useState()
  const [period, setPeriod] = useState({})

  useEffect(() => {
      apiClient.setTokenManager(tokenManager)
      mainLayout.current.handleChangeRepositoryId(id)
      apiClient.weeklyImpact.getWeeklyImpactStats(id).then((response) => {
        setGridItems(buildGridItemsWeeklyImpact(response, gridItems))
        setPeriod(calculatePeriod(response.period))
        setResponse(response)
      })
    }, [id, mainLayout, tokenManager]
  )

  const impactSession = gridItemsState.map((item) => {
    if (item.name !== 'Most churned file') {
      return (
        <Grid
          key={item.name}
          item
          xs={3}
          className={clsx(
            classes.gridItem,
            classes.subGridItem,
            item.name === IMPACT_SCORE_TXT && classes.highlightSubGridItem
          )}
        >
          <Grid container style={{ height: '100%' }}>
            <Grid item xs={12}>
              <ListItemText
                className={clsx(classes.itemNameTxt, item.name === IMPACT_SCORE_TXT && classes.whiteFontTxt)}
              >
                {item.name}
              </ListItemText>
            </Grid>
            <Grid item xs={12}>
              <ListItemText className={classes.itemValueTxt}>
                {item.name === 'Commits/day' ? item.currentPeriod.toFixed(1) : item.currentPeriod}
              </ListItemText>
            </Grid>
            {item.diffValue !== undefined &&
            <Grid item xs={12}>
              <ListItemText
                className={classes.itemDiffValueTxt}
                style={{ background: item.diffValue >= 0 ? '#62C8BA' : '#EC5D5C' }}
              >{`${item.diffValue >= 0 ? '+' : ''}${item.diffValue}%`}</ListItemText>
            </Grid>}
            <Grid item xs={12} className={classes.itemLast}>
              <ListItemText
                className={clsx(classes.itemPreviousTxt, item.name === IMPACT_SCORE_TXT && classes.whiteFontTxt)}
              >
                {`From previous period (${
                  item.name === 'Commits/day' ? item.previousPeriod.toFixed(1) : item.previousPeriod
                })`}
              </ListItemText>
            </Grid>
          </Grid>
        </Grid>
      )
    } else {
      return (
        <Grid key={item.name} item xs={3} className={clsx(classes.gridItem, classes.subGridItem)}>
          <Grid container style={{ height: '100%' }}>
            <Grid item xs={12}>
              <ListItemText className={classes.itemNameTxt}>{item.name}</ListItemText>
            </Grid>
            <Grid item xs={12}>
              {item.mostChurnedFiles.map((mostChurnedFile) => (
                <ListItemText key={mostChurnedFile.fileName} className={classes.itemChurnedFileName}>
                  {mostChurnedFile.fileName}
                </ListItemText>
              ))}
            </Grid>
            <Grid item xs={12} className={classes.itemLast}>
              {item.mostChurnedFiles.map((mostChurnedFile) => (
                <ListItemText
                  key={mostChurnedFile.fileName}
                  className={classes.itemPreviousTxt}
                >{`Edited ${mostChurnedFile.value} times this week`}</ListItemText>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )
    }
  })

  const developerFocusSession = (
    <Grid container className={classes.subContainer}>
      <Grid item xs={4}>
        <ListItemText disableTypography className={classes.developmentFocusHeader}>
          Development Focus
        </ListItemText>
        <ListItemText disableTypography className={classes.developmentFocusDesc}>
          {`Team focus most on ${calculateFocusData(response, chartItems)} in last week`}
        </ListItemText>
      </Grid>
      <Grid item xs={4}>
        <Grid container className={classes.subContainer}>
          {response &&
            chartItems.map((chartItem) => {
              const data = calculateChartData(response[chartItem.fieldName], chartItem)
              return (
                <Grid key={chartItem.fieldName} item xs={6}>
                  <Chart
                    chartType={chartTypeEnum.BAR}
                    data={data}
                    chartOptions={buildChartOptionsBasedOnMaxValue(response, chartItems)}
                    chartBars={chartItem}
                    isNeedReDrawOptions={false}
                    isLegendClickable={false}
                    chartLegendId={chartItem.chartLegendId}
                    disableLegend={true}
                    customsStyle={{ height: '30vh' }}
                    customToolTip={customToolTip}
                  />
                </Grid>
              )
            })}
          <ChartToolTip id={'chartjs-tooltip'} />
        </Grid>
      </Grid>
    </Grid>
  )

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Weekly Impact</PageTitle>
      <Grid container className={classes.root}>
        <Grid item xs={12} className={classes.gridItem}>
          <ListItemText className={classes.descriptionTxt}>
            Team accomplishment for the week of {period.dateFrom} to {period.dateTo}
          </ListItemText>
        </Grid>
        <Grid item xs={12} className={classes.gridItem} style={{ marginTop: '5vh' }}>
          <Grid container className={classes.subContainer}>
            {impactSession}
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.gridItem} style={{ marginTop: '5vh' }}>
          {developerFocusSession}
        </Grid>
      </Grid>
    </div>
  )
}

export default WeeklyImpact
