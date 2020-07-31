import moment from 'moment'
import { getMonth, getNumberOfMonthForward, getMonthNumberFromMonthName } from '../utils/dateUtils'

const dateFormat = 'Do MMM'

export const createReversedArray = (array) => {
  const reversedArray = array.reduce((acc, b) => [b, ...acc], [])

  return reversedArray
}

export const transformPeriodToDateRange = (period) => {
  const today = new Date()
  let endDay = null
  if (period === 'Last 7 Days') endDay = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
  else if (period === 'Last 14 Days') endDay = new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000)
  else if (period === 'Last 21 Days') endDay = new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000)
  else if (period === 'Last 30 Days') endDay = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000)

  return {
    period_date_from: endDay,
    period_date_to: today,
  }
}

export const transformToChartData = (lines, bars, rawData, xAxis) => {
  let dataSets = []
  let labels
  if (xAxis === 'Date') {
    labels = rawData.flatMap((item) => moment(item[xAxis]).format(dateFormat))
  } else {
    labels = rawData.flatMap((item) => item[xAxis])
  }
  lines.forEach((chartItem) => {
    const dataArray = rawData.flatMap((rawDataItem) => rawDataItem[chartItem.name])
    let yAxisId = chartItem.yAxisId
    const dataSetsItem = {
      label: chartItem.name,
      type: 'line',
      data: dataArray,
      fill: false,
      borderColor: chartItem.color,
      backgroundColor: chartItem.color,
      pointBorderColor: chartItem.color,
      pointBackgroundColor: chartItem.color,
      pointHoverBackgroundColor: chartItem.color,
      pointHoverBorderColor: chartItem.color,
      borderDash: chartItem.dash,
      yAxisID: yAxisId,
      lineTension: 0.001,
      datalabels: {
        display: chartItem.dataLabelsDisplay ? true : false,
        color: chartItem.color,
        font: {
          weight: 'bold',
        },
      },
    }
    dataSets.push(dataSetsItem)
  })
  bars.forEach((chartItem) => {
    const dataArray = rawData.flatMap((rawDataItem) => rawDataItem[chartItem.name])
    const dataSetsItem = {
      label: chartItem.name,
      type: 'bar',
      data: dataArray,
      fill: false,
      stack: chartItem.stackId,
      backgroundColor: chartItem.color,
      borderColor: 'white',
      hoverBackgroundColor: chartItem.color,
      hoverBorderColor: chartItem.color,
      yAxisID: 'y-axis-1',
      barPercentage: chartItem.barPercentage ? chartItem.barPercentage : 0.5,
      categoryPercentage: chartItem.categoryPercentage ? chartItem.categoryPercentage : 0.9,
      borderWidth: {
        top: 2,
        right: 0,
        bottom: 0,
        left: 0,
      },
      datalabels: {
        display: chartItem.dataLabelsDisplay ? true : false,
        color: chartItem.color,
        font: {
          weight: 'bold',
        },
      },
    }
    dataSets.push(dataSetsItem)
  })
  return {
    labels: labels,
    datasets: dataSets,
  }
}

export const transformDataForBubbleChart = (chartData) => {
  let labels = []
  let smallPullRequests = {
    label: 'Small Pull Requests',
    fill: false,
    lineTension: 0.1,
    backgroundColor: '#62C8BA',
    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    pointRadius: 1,
    pointHitRadius: 10,
    data: [],
  }

  let bigPullRequests = {
    label: 'Big Pull Requests',
    fill: false,
    lineTension: 0.1,
    backgroundColor: '#EC5D5C',
    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    pointRadius: 1,
    pointHitRadius: 10,
    data: [],
  }

  let minPrSize
  let maxPrSize
  const maxSizeForSmallPr = 300
  Object.keys(chartData).forEach((key) => {
    chartData[key].forEach((pr) => {
      if(minPrSize === undefined || maxPrSize === undefined) {
        minPrSize = pr.size
        maxPrSize = pr.size
      } else if(pr.size >= maxPrSize) {
        maxPrSize = pr.size
      } else if(pr.size < minPrSize) {
        minPrSize = pr.size
      }
    })
  })

  Object.keys(chartData).forEach((date) => {
    const dateLabel = moment(date).format(dateFormat)
    labels.push(dateLabel)

    const prs = chartData[date]

    let prevYPosition = 0
    let prevPrSize = 0

    prs.forEach((pr) => {
      const prSize = pr.size

      // small pull request will be scaled between 20px and 5px in size
      if(prSize < maxSizeForSmallPr) {
        const nomarlizedSize =  (20 - 5)*((prSize  - minPrSize) / (maxSizeForSmallPr - minPrSize)) + 5

        smallPullRequests.data.push({
          x: dateLabel,
          y: prevYPosition,
          r: nomarlizedSize,
        })
      } else {
       // big pull request will be scaled between 30px and 20px in size 
        const nomarlizedSize =  (30 - 20)*((prSize  - maxSizeForSmallPr) / (maxPrSize - maxSizeForSmallPr)) + 20

        bigPullRequests.data.push({
          x: dateLabel,
          y: prevYPosition,
          r: nomarlizedSize,
        })
      }

      let distanceBetweenTwoPr
      if(prevPrSize + prSize > 40) {
        distanceBetweenTwoPr = 30
      } else if(prevPrSize + prSize >= 20) {
        distanceBetweenTwoPr = 20
      } else {
        distanceBetweenTwoPr = 15
      }

      prevYPosition += distanceBetweenTwoPr
      prevPrSize = prSize
    })
  })

  return {
    labels: labels,
    datasets: [
      smallPullRequests,
      bigPullRequests,
    ]
  }
}

export const filterTableData = (tableData, tableColumn) => {
  if (tableData) {
    return tableData.map((item) => {
      if (item['Date']) {
        item['Date'] = moment(item['Date']).format(dateFormat)
      }
      return Object.assign(...tableColumn.map((object) => ({ [object.text]: item[object.fieldName] })))
    })
  }
  return []
}

export const convertTableObjectToTableColumn = (tableObject) => {
  return tableObject.flatMap((item) => ({
    title: item.text,
    field: item.text,
    type: item.type ? item.type : 'string',
    searchable: item.searchable ? true : false,
    cellStyle: item.cellStyle,
    render: item.render,
  }))
}

export const transformChartDataWithValueAbove = (data, chartBar, dateFrom, dateTo, customFormatter) => {
  if (data) {
    const objectKeys = Object.keys(data)
    const monthArrays = getMonthNumberFromMonthName(objectKeys)
    const chartFullData = createChartFullData(data, dateFrom, dateTo, monthArrays)
    const labels = chartFullData.labels
    const chartData = chartFullData.chartData

    const dataSets = [
      {
        label: chartBar.name,
        backgroundColor: chartBar.color,
        borderColor: chartBar.color,
        hoverBackgroundColor: chartBar.color,
        borderWidth: 1,
        data: chartData,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
        datalabels: {
          color: chartBar.color,
          font: {
            weight: 'bold',
          },
          formatter: customFormatter
            ? customFormatter
            : (value, context) => {
                const { dataIndex, dataset } = context
                if (dataIndex === 0 || dataset.data[dataIndex - 1] === 0) {
                  return ''
                } else {
                  value = Math.round(((value - dataset.data[dataIndex - 1]) / dataset.data[dataIndex - 1]) * 100)
                  return value + '%'
                }
              },
        },
      },
    ]
    return {
      labels: labels,
      datasets: dataSets,
    }
  }
}

export const createChartFullData = (data, dateFrom, dateTo, monthArrays) => {
  const chartData = []
  const labels = []
  const years = []
  while (dateFrom <= dateTo) {
    const month = getMonth(dateFrom * 1000)
    const index = monthArrays.findIndex((item) => Number(item) === month)
    const monthName = moment(month, 'M').format('MMMM')
    if (index === -1) {
      chartData.push(0)
    } else {
      chartData.push(Number(data[monthName]))
    }
    labels.push(monthName)
    years.push(moment(dateFrom * 1000).year())
    dateFrom = getNumberOfMonthForward(dateFrom * 1000, 1).unix()
  }
  return {
    chartData: chartData,
    labels: labels,
    years: years,
  }
}

export const createDumpDataIfMissing = (data, dateRange) => {
  if (data) {
    let { date_from, date_to } = dateRange
    date_from = moment(date_from * 1000).unix()
    date_to = moment(date_to * 1000).unix()
    const result = []
    while (date_from <= date_to) {
      const date = moment(date_from)
      const index = data.findIndex((item) => moment(item.date).isSame(date, 'day'))
      if (index !== -1) {
        result.push({
          date: data[index].date,
          additions: data[index] ? data[index].additions : 0,
          changePercent: data[index] ? data[index].changePercent : 0,
          commits: data[index] ? data[index].commits : 0,
          deletions: data[index] ? data[index].deletions : 0,
          filesChange: data[index] ? data[index].filesChange : 0,
          email: data[index] ? data[index].email : '',
        })
      } else {
        result.push({
          date: date,
          additions: 0,
          changePercent: 0,
          commits: 0,
          deletions: 0,
          filesChange: 0,
          email: '',
        })
      }

      date_from = date_from + 24 * 3600000
    }

    return result
  }
}

export const calculateHightLightState = (responseData, dateFrom, dateTo, chartItems) => {
  let hightLightNumber = Number.MIN_SAFE_INTEGER
  let maxHighLightValue = {}
  const keys = Object.keys(responseData)
  keys.forEach((key) => {
    const dataSet = responseData[key]
    const objectKeys = Object.keys(dataSet)
    const monthArrays = getMonthNumberFromMonthName(objectKeys)
    const fullData = createChartFullData(dataSet, dateFrom, dateTo, monthArrays)
    const data = fullData.chartData
    const monthsName = fullData.labels
    const years = fullData.years
    const chartIndex = chartItems.findIndex((chartItem) => chartItem.fieldName === key)

    if (chartIndex !== -1) {
      //calculate index based line
      let indexBaseLine
      for (let i = 0; i < data.length; i++) {
        if (indexBaseLine === undefined) {
          indexBaseLine = calculateIndexBaseLine(
            responseData,
            chartItems[chartIndex].fieldName,
            i,
            data,
            dateFrom,
            dateTo
          )
        }
      }

      if (indexBaseLine === undefined && !maxHighLightValue.hightLightNumber) {
        maxHighLightValue = {
          hightLightNumber: '',
          highLightTypeName: '',
          highLightTime: '',
          descriptonTxt: 'Currently, there is no data to display for this quarter',
          highLightColor: chartItems[chartIndex].color,
        }
      } else if (indexBaseLine === data.length - 1 && !maxHighLightValue.hightLightNumber) {
        maxHighLightValue = {
          hightLightNumber: '',
          highLightTypeName: '',
          highLightTime: '',
          descriptonTxt: `Currently, there is no data to display for ${monthsName[0]} ${years[0]} and ${monthsName[1]} ${years[1]}`,
          highLightColor: chartItems[chartIndex].color,
        }
      } else {
        const metricName = chartItems[chartIndex].name
        for (let i = indexBaseLine; i < data.length; i++) {
          const monthFrom = monthsName[indexBaseLine]
          const monthTo = monthsName[i]
          const yearFrom = years[indexBaseLine]
          const yearTo = years[i]
          let value = 0

          if (data[indexBaseLine] !== 0) {
            if (key !== 'percentageRejectedPR') {
              value = Math.round(((data[i] - data[indexBaseLine]) / data[indexBaseLine]) * 100)
            } else {
              value = data[i] - data[indexBaseLine]
            }
          }

          if (Math.abs(value) > hightLightNumber) {
            maxHighLightValue = {
              hightLightNumber: (value > 0 ? '+' : '') + value + '%',
              highLightTypeName: metricName,
              highLightTime: `${monthFrom} ${yearFrom} vs ${monthTo} ${yearTo}`,
              descriptonTxt: `${metricName} ${value < 0 ? 'reduced' : 'increased'} by ${Math.abs(
                value
              )} percent from ${monthFrom} ${yearFrom} to ${monthTo} ${yearTo}`,
              highLightColor: chartItems[chartIndex].color,
            }
            hightLightNumber = Math.abs(value)
          }
        }
      }
    }
  })

  return {
    hightLightNumber: maxHighLightValue.hightLightNumber,
    highLightTypeName: maxHighLightValue.highLightTypeName,
    highLightTime: maxHighLightValue.highLightTime,
    descriptonTxt: maxHighLightValue.descriptonTxt,
    highLightHeader: 'HIGHEST % CHANGE',
    highLightColor: maxHighLightValue.highLightColor,
  }
}

export const buildGridItemsWeeklyImpact = (responseData, gridItems) => {
  return gridItems.map((item) => {
    const data = responseData[item.fieldName]
    const diffValue = !(data.previousPeriod === 0)
                        ? Math.round(((data.currentPeriod - data.previousPeriod) / Math.abs(data.previousPeriod)) * 100)
                        : undefined
    if (item.fieldName !== 'mostChurnedFiles') {
      return {
        name: item.name,
        currentPeriod: data.currentPeriod,
        previousPeriod: data.previousPeriod,
        diffValue: diffValue,
      }
    } else {
      return {
        name: item.name,
        mostChurnedFiles: data,
      }
    }
  })
}

export const calculateIndexBaseLine = (fullData, fieldName, dataIndex, chartDataItem, dateFrom, dateTo) => {
  if (fieldName === 'percentageRejectedPR') {
    let found = false
    const keysFullData = Object.keys(fullData)
    for (let index = 0; index < keysFullData.length; index++) {
      const dataType = keysFullData[index]
      const dataItem = fullData[dataType]
      const objectKeys = Object.keys(dataItem)
      const monthArrays = getMonthNumberFromMonthName(objectKeys)
      const chartFullData = createChartFullData(dataItem, dateFrom, dateTo, monthArrays)
      found = chartFullData.chartData[dataIndex] === 0 ? false : true
      if (found) {
        return dataIndex
      }
    }
    return undefined
  } else {
    return chartDataItem[dataIndex] !== 0 ? dataIndex : undefined
  }
}

export const calculateChartData = (fullData, chartItem, dateFrom, dateTo) => {
  const fieldName = chartItem.fieldName
  const dataItem = fullData[fieldName]
  if (dataItem) {
    const objectKeys = Object.keys(dataItem)
    const monthArrays = getMonthNumberFromMonthName(objectKeys)
    const chartFullData = createChartFullData(dataItem, dateFrom, dateTo, monthArrays)
    const dataArrays = []
    const chartData = chartFullData.chartData
    let indexBaseLine
    for (let i = 0; i < chartData.length; i++) {
      if (indexBaseLine === undefined) {
        indexBaseLine = calculateIndexBaseLine(fullData, fieldName, i, chartData, dateFrom, dateTo)
        dataArrays.push(indexBaseLine !== undefined ? 0 : undefined)
      } else {
        const value =
          fieldName === 'percentageRejectedPR'
            ? chartData[i] - chartData[indexBaseLine]
            : Math.round(((chartData[i] - chartData[indexBaseLine]) / chartData[indexBaseLine]) * 100)
        dataArrays.push(value)
      }
    }
    const chartItemResult = {
      label: chartItem.name,
      type: 'line',
      data: dataArrays,
      fill: false,
      yAxisID: 'y-axis-1',
      borderColor: chartItem.color,
      backgroundColor: chartItem.color,
      pointBorderColor: chartItem.color,
      pointBackgroundColor: chartItem.color,
      pointHoverBackgroundColor: chartItem.color,
      pointHoverBorderColor: chartItem.color,
      borderDash: chartItem.dash,
      lineTension: 0.001,
      datalabels: {
        display: chartItem.dataLabelsDisplay ? true : false,
        color: chartItem.color,
        font: {
          weight: 'bold',
        },
      },
    }
    return {
      chartItemResult: chartItemResult,
      labels: chartFullData.labels,
    }
  }
}
