import React, { useEffect, useRef, useContext, useState } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import PageTitle from '../components/PageTitle'
import { makeStyles, styled } from '@material-ui/core/styles'
import { ApiClient } from '../apis'
import MainLayoutContex from '../contexts/MainLayoutContext'
import { Grid, ListItemText, List, Divider, Paper, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import { buildGridItemsWeeklyImpact } from '../utils/dataUtils'
import { formatToMMDD } from '../utils/dateUtils'
import Chart, { chartTypeEnum } from '../components/Chart'
import { buildChartOptionsBasedOnMaxValue } from '../utils/chartUtils'
import DatePicker from '../components/DatePicker'
import { getDayStartOfCurrentWeek, addNumberOfDays, getDayStartOfWeekPointOfTime } from '../utils/dateUtils'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

const information = `Impact measures the magnitude of code changes, and our inhouse formula takes into consideration more than just lines of code`
const IMPACT_SCORE_TXT = 'Impact score'
const COMMITS_PER_DAY = 'Commits/day'
const CHART_TOOLTIP = 'chartjs-tooltip'

const gridItems = [
  { name: IMPACT_SCORE_TXT, fieldName: 'impactScore' },
  { name: 'Active days', fieldName: 'activeDays' },
  { name: COMMITS_PER_DAY, fieldName: 'commitsPerDay' },
  { name: 'Most churned file', fieldName: 'mostChurnedFiles' },
]

const impactScoreItems = [
  {
    name: 'files',
    fieldName: 'fileChanged',
    dropDescription: 'Fewer number of files was changed',
    increaseDescription: 'More number of files was changed',
  },
  {
    name: 'insertions points',
    fieldName: 'insertionPoints',
    dropDescription: 'There were lesser number of insertion points',
    increaseDescription: 'There was more number of insertion points',
  },
  {
    name: 'old codes',
    fieldName: ['legacyPercentage', 'churnPercentage'],
    dropDescription: 'Lesser edits was made to old code',
    increaseDescription: 'More edits was made to old code',
  },
  {
    name: 'new codes',
    fieldName: 'newCodePercentage',
    dropDescription: 'Lesser new code was written',
    increaseDescription: 'More new code was written',
  },
  {
    name: 'lines of code',
    fieldName: 'additions',
    dropDescription: 'Fewer lines of code were added',
    increaseDescription: 'More lines of code were added',
  },
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
    height: '32vh',
    alignContent: 'flex-start',
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
  reasonRoot: {
    width: '95%',
    marginTop: '3vh',
  },
  reasonTxt: {
    fontSize: 15,
    lineHeight: '5vh',
    margin: '0px 0px 0px 1vw',
    height: '5vh',
  },
  toolTipTxt: {
    background: '#000000',
    fontSize: 9,
    padding: '35px 40px 40px 26px',
    marginRight: '10vw',
    borderRadius: 8,
    minHeight: 100,
    whiteSpace: 'pre-line',
  },
  tooltipIcon: {
    marginTop: '3vh',
  },
  impactScoreUnitTxt: {
    fontSize: '15px',
  },
}))

const chartItems = [
  { name: 'New Code', color: '#62C8BA', fieldName: 'newCodePercentage', chartLegendId: 'chart-legend-1' },
  { name: 'Churn', color: '#EC5D5C', fieldName: 'churnPercentage', chartLegendId: 'chart-legend-2' },
  { name: 'Legacy refactor', color: '#9F55E2', fieldName: 'legacyPercentage', chartLegendId: 'chart-legend-3' },
]

const ChartToolTip = styled('div')(({ theme }) => ({
  '&': {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 1)',
    color: 'white',
    borderRadius: '10px',
    fontFamily: 'Poppins',
    pointerEvents: 'none',
    maxWidth: '20vw'
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
    fontSize: '10px',
    flexDirection: 'column',
    padding: '0px',
  },
  '& li': {
    textAlign: 'left',
    height: '20px',
    fontWeight: 'bold',
    margin: '1vh 0.5vh',
  },
  '& li div': {
    float: 'right',
    margin: '0px 1vw',
  },
}))

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
  let tooltipEl = document.getElementById(CHART_TOOLTIP)
  const chartInstance = chartRef.current.chartInstance

  // Create element on first render
  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.id = CHART_TOOLTIP
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
    const titleLines = tooltipModel.title || []
    const bodyLines = tooltipModel.body.map((bodyItem) => bodyItem.lines)

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
            label =
              'What percentage of total changes was churn. Churn is the code that was changed within 21 days of writing.'
            break
          case 'New Code':
            label = 'What percentage of total changes is new lines of code'
            break
          case 'Legacy refactor':
            label =
              'What percentage of total changes was refactoring. Legacy refactor is the code that was changed after 21 days of writing.'
            break
          default:
            label = ''
        }
        innerHtml += `<li>
                      ${label}
                    </li>`
        const tableRoot = tooltipEl.querySelector('ul')
        tableRoot.innerHTML = innerHtml
      }
    }

    // `this` will be the overall tooltip
    const position = chartInstance.canvas.getBoundingClientRect()

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 0.9
    const left = position.left + window.pageXOffset + tooltipModel.caretX
    tooltipEl.style.left =
      left + tooltipEl.offsetWidth > window.innerWidth ? left - tooltipEl.offsetWidth + 'px' : left + 'px'
    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'
    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
  }
}

const CustomOverLay = styled('div')(({ theme }) => ({
  '&': { 
    width: '100%', 
    borderBottom: '2px solid #000000', 
    textAlign: 'center', 
    fontSize: '1vw', 
    padding: '1.5vh 0px' },
}))

const calculateFocusData = (response, chartItems) => {
  if (response) {
    let focusItemIndex = -1
    let maxValue = Number.MIN_SAFE_INTEGER
    chartItems.forEach((item, i) => {
      const value = response[item.fieldName].currentPeriod
      if (value > maxValue) {
        maxValue = value
        focusItemIndex = i
      }
    })
    if (focusItemIndex !== -1) {
      return chartItems[focusItemIndex].name
    }
    return ''
  }
}

const impactScoreToolTipInformation = `Impact score is calculated using the following metrics, giving different weightage to all
\nNumber of files changed
\nNumber of insertion points/edit locations
\nWhat percentage of work is edits to old code
\nWhat percentage of work is newly written code
\nAdditions in lines of code`

const buildImpactScoreReasonSession = (response) => {
  let impactReasoneResult = []
  if (response) {
    if (
      response.impactScore.currentPeriod === 0 &&
      response.activeDays.currentPeriod === 0 &&
      response.commitsPerDay.currentPeriod === 0
    ) {
      impactReasoneResult.push('There was no activity recorded in the last week')
    } else {
      const isDropped = response.impactScore.currentPeriod < response.impactScore.previousPeriod
      impactReasoneResult = impactScoreItems.flatMap((item) => {
        let previousValue = 0
        let currentValue = 0
        if (item.name !== 'old codes') {
          previousValue = response[item.fieldName].previousPeriod
          currentValue = response[item.fieldName].currentPeriod
        } else {
          previousValue = response[item.fieldName[0]].previousPeriod + response[item.fieldName[1]].previousPeriod
          currentValue = response[item.fieldName[0]].currentPeriod + response[item.fieldName[1]].currentPeriod
        }

        if(previousValue === currentValue) {
          return ''
        }

        if (item.name === 'old codes' || item.name === 'new codes') {
          previousValue = `${previousValue.toFixed(2)}%`
          currentValue = `${currentValue.toFixed(2)}%`
        }

        if (isDropped === (currentValue < previousValue)) {
          return `${item[isDropped ? 'dropDescription' : 'increaseDescription']} (${currentValue} vs ${previousValue})`
        }
        return ''
      })
    }
    return impactReasoneResult.filter((item) => item !== '')
  }
}

const customTitleOverLay = <CustomOverLay >Select The first day (Monday only)</CustomOverLay>

const initDateRangeValue = () => {
  const monDayOfCurrentWeek = getDayStartOfCurrentWeek()
  const dateFrom = addNumberOfDays(monDayOfCurrentWeek, -7)
  const dateTo = addNumberOfDays(dateFrom, 6)
  return {
    from: dateFrom.toDate(),
    to: dateTo.toDate(),
  }
}

function WeeklyImpact(props) {
  const { id } = props.match.params
  const classes = useStyles()
  const { authService } = useOktaAuth()
  const mainLayout = useRef(useContext(MainLayoutContex))
  const [gridItemsState, setGridItems] = useState([])
  const [response, setResponse] = useState()
  const [reasoneImpactScore, setReasoneImpactScore] = useState([])
  const [period, setPeriod] = useState({})
  const [unsualFiles, setUnsualFiles] = useState([])
  const [dateRange, setDateRange] = useState(initDateRangeValue())

  useEffect(() => {
    apiClient.setAuthService(authService)
    mainLayout.current.handleChangeRepositoryId(id)
    apiClient.weeklyImpact.getWeeklyImpactStats(id, dateRange).then((response) => {
      setGridItems(buildGridItemsWeeklyImpact(response, gridItems))
      setPeriod(calculatePeriod(response.period))
      setReasoneImpactScore(buildImpactScoreReasonSession(response))
      setUnsualFiles(response.unusualFiles)
      setResponse(response)
    })
  }, [id, mainLayout, authService, dateRange])

  const handleDayClick = (day) => {
    const dateFrom = getDayStartOfWeekPointOfTime(day)
    const dateTo = addNumberOfDays(dateFrom, 6)

    const dateRangeValue = {
      from: dateFrom.toDate(),
      to: dateTo.toDate(),
    }

    setDateRange(dateRangeValue)
    return {
      from: dateFrom.toDate(),
      to: dateTo.toDate(),
    }
  }

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
          <Grid container style={{ height: '32vh' }}>
            <Grid item xs={12}>
              <Grid container style={{ alignItems: 'flex-end' }}>
                <Grid item>
                  <ListItemText
                    className={clsx(classes.itemNameTxt, item.name === IMPACT_SCORE_TXT && classes.whiteFontTxt)}
                  >
                    {item.name}
                  </ListItemText>
                </Grid>
                <Grid item style={{ marginLeft: '0.5vw' }}>
                  {item.name === IMPACT_SCORE_TXT && (
                    <Tooltip
                      title={impactScoreToolTipInformation}
                      placement="bottom-start"
                      enterDelay={500}
                      enterNextDelay={500}
                      classes={{ tooltip: classes.toolTipTxt }}
                    >
                      <InfoOutlinedIcon />
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <ListItemText className={classes.itemValueTxt}>
                {item.name === COMMITS_PER_DAY ? item.currentPeriod.toFixed(1) : item.currentPeriod}
                {item.name === IMPACT_SCORE_TXT && <span className={classes.impactScoreUnitTxt}>pts</span>}
              </ListItemText>
            </Grid>
            {item.diffValue !== undefined && (
              <Grid item xs={12}>
                <ListItemText
                  className={classes.itemDiffValueTxt}
                  style={{ background: item.diffValue > 0 ? '#62C8BA' : item.diffValue === 0 ? '#C4C4C4' : '#EC5D5C' }}
                >{`${item.diffValue > 0 ? '+' : ''}${item.diffValue}%`}</ListItemText>
              </Grid>
            )}
            <Grid item xs={12} className={classes.itemLast}>
              <ListItemText
                className={clsx(classes.itemPreviousTxt, item.name === IMPACT_SCORE_TXT && classes.whiteFontTxt)}
              >
                {`From previous period (${
                  item.name === COMMITS_PER_DAY ? item.previousPeriod.toFixed(1) : item.previousPeriod
                }${item.name === IMPACT_SCORE_TXT ? ' pts' : ''})`}
              </ListItemText>
            </Grid>
          </Grid>
        </Grid>
      )
    } else {
      return (
        <Grid key={item.name} item xs={3} className={clsx(classes.gridItem, classes.subGridItem)}>
          <Grid container style={{ height: '32vh' }}>
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

  const iSFocusHavingData =
    response && chartItems.findIndex((item) => response[item.fieldName].currentPeriod !== 0) !== -1

  const developerFocusSession = (
    <Grid container className={classes.subContainer}>
      <Grid item xs={3}>
        <ListItemText disableTypography className={classes.developmentFocusHeader}>
          Development Focus
        </ListItemText>
        {iSFocusHavingData && (
          <ListItemText disableTypography className={classes.developmentFocusDesc}>
            {`Team focused most on ${calculateFocusData(response, chartItems)} in last week`}
          </ListItemText>
        )}
        {!iSFocusHavingData && (
          <ListItemText disableTypography className={classes.developmentFocusDesc}>
            {`There was no activity recorded in the last week`}
          </ListItemText>
        )}
      </Grid>
      <Grid item xs={4}>
        <Grid container className={classes.subContainer}>
          {response &&
            chartItems.map((chartItem) => {
              const data = calculateChartData(response[chartItem.fieldName], chartItem)
              return (
                <Grid key={chartItem.fieldName} item xs={4}>
                  <Chart
                    chartType={chartTypeEnum.BAR}
                    data={data}
                    chartOptions={buildChartOptionsBasedOnMaxValue(response, chartItems)}
                    isLegendClickable={false}
                    chartLegendId={chartItem.chartLegendId}
                    isLegendDisabled={true}
                    customsStyle={{ height: '30vh' }}
                    customToolTip={customToolTip}
                  />
                </Grid>
              )
            })}
          <ChartToolTip id={CHART_TOOLTIP} />
        </Grid>
      </Grid>
    </Grid>
  )

  const reasonsSession = (
    <Grid container className={classes.subContainer}>
      <Grid item xs={12}>
        <ListItemText disableTypography className={classes.developmentFocusHeader}>
          Why did the impact score{' '}
          {(response && response.impactScore.currentPeriod < response.impactScore.previousPeriod) > 0
            ? 'drop'
            : 'increase'}
          ?
        </ListItemText>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.reasonRoot}>
          <List>
            {reasoneImpactScore.map((item, index) => (
              <>
                <ListItemText disableTypography className={classes.reasonTxt}>
                  {item}
                </ListItemText>
                {index !== reasoneImpactScore.length - 1 && <Divider />}
              </>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  )

  const unsualFilesView =
    unsualFiles && unsualFiles.length > 0 ? (
      <Grid item xs={12} className={classes.gridItem}>
        <Grid container style={{ width: '100%' }}>
          <Grid item xs={12}>
            <Grid container style={{ alignItems: 'center' }}>
              <Grid item className={classes.tooltipIcon}>
                <ListItemText className={classes.descriptionTxt}>Unsual files</ListItemText>
              </Grid>
              <Grid item className={classes.tooltipIcon} style={{ marginLeft: '0.5vw' }}>
                <Tooltip
                  title={'Files with exceptionally high number of additions in lines of code'}
                  placement="bottom-start"
                  enterDelay={500}
                  enterNextDelay={500}
                  classes={{ tooltip: classes.toolTipTxt }}
                >
                  <InfoOutlinedIcon />
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.reasonRoot}>
              <List>
                {unsualFiles.map((unsualFile, index) => (
                  <>
                    <ListItemText disableTypography className={classes.reasonTxt}>
                      {unsualFile.fileName}
                    </ListItemText>
                    {index !== unsualFiles.length - 1 && <Divider />}
                  </>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    ) : undefined

  const weeklyImpactView = response && (
    <>
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
      {unsualFilesView}
      <Grid item xs={12} className={classes.gridItem} style={{ marginTop: '5vh' }}>
        {reasonsSession}
      </Grid>
      <Grid item xs={12} className={classes.gridItem} style={{ marginTop: '5vh' }}>
        {developerFocusSession}
      </Grid>
    </>
  )

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Weekly Impact</PageTitle>
      <Grid container className={classes.root}>
        <Grid item xs={4} style={{ marginBottom: '2vh' }}>
          <DatePicker
            label="Date Range"
            customDisabledDays={[{ daysOfWeek: [0, 2, 3, 4, 5, 6] }, { after: new Date() }]}
            customDayClick={handleDayClick}
            initDateRange={dateRange}
            customTitleOverLay={customTitleOverLay}
          />
        </Grid>
        {weeklyImpactView}
      </Grid>
    </div>
  )
}

export default WeeklyImpact
