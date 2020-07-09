import moment from 'moment'
import {getMonth, getNumberOfMonthForward} from '../utils/dateUtils'

const dateFormat = 'Do MMM'

export const createReversedArray = (array) => {
  const reversedArray = array.reduce((acc, b) => [b, ...acc], [])

  return reversedArray
}

export const transformPeriodToDateRange = (period) => {
  const today =  new Date()
  let endDay = null
  if(period === 'Last 7 Days')
    endDay = new Date(today.getTime() - (6 * 24 * 60 * 60 * 1000))
  else if(period === 'Last 14 Days')
    endDay = new Date(today.getTime() - (13 * 24 * 60 * 60 * 1000))
  else if(period === 'Last 21 Days')
    endDay = new Date(today.getTime() - (20 * 24 * 60 * 60 * 1000))
  else if(period === 'Last 30 Days')
    endDay = new Date(today.getTime() - (29 * 24 * 60 * 60 * 1000))

  return {
    period_date_from: endDay,
    period_date_to: today
  }
}

export const transformToChartData = (lines, bars, rawData, xAxis) => {
  let dataSets = [];
  let labels;
  if(xAxis === 'Date') {
    labels = rawData.flatMap(item => moment(item[xAxis]).format(dateFormat));
  } else {
    labels = rawData.flatMap(item => item[xAxis]);
  }
  lines.forEach(chartItem => {
    const dataArray = rawData.flatMap(rawDataItem => rawDataItem[chartItem.name]);
    let yAxisId = chartItem.yAxisId
    const dataSetsItem = {
      label: chartItem.name,
      type:'line',
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
          weight: 'bold'
        }
      }
    }
    dataSets.push(dataSetsItem);
  })
  bars.forEach(chartItem => {
    const dataArray = rawData.flatMap(rawDataItem => rawDataItem[chartItem.name]);
    const dataSetsItem = {
      label: chartItem.name,
      type:'bar',
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
        left: 0
      },
      datalabels: {
        display: chartItem.dataLabelsDisplay ? true : false,
        color: chartItem.color,
        font: {
          weight: 'bold'
        }
      }
    }
    dataSets.push(dataSetsItem);
  })
  return {
    labels: labels,
    datasets: dataSets
  }
}

export const filterTableData =  (tableData, tableColumn) => {
  if(tableData) {
    return tableData.map((item) => {
      if(item['Date']) {
        item['Date'] = moment(item['Date']).format(dateFormat)
      }
      return Object.assign(...tableColumn.map((object) => ({[object.text]: item[object.fieldName]})))
    })
  }
  return [];
}

export const convertTableObjectToTableColumn =  (tableObject) => {
  return tableObject.flatMap(item => ({
    title: item.text,
    field: item.text,
    type: (item.type) ? item.type : 'string',
    searchable: item.searchable ? true : false,
    cellStyle: item.cellStyle,
    render: item.render
  }))
}

export const transformChartDataWithValueAbove = (data, chartBar, dateFrom, dateTo, customFormatter) => {
  if(data) {
    const objectKeys = Object.keys(data);
    const labels = []
    const monthArrays = [];
    objectKeys.forEach(key => {
      monthArrays.push(moment().month(key).format("M"))
    })

    const chartData = []
    // create dump data if not in response
    while(dateFrom <= dateTo) {
      const month = getMonth(dateFrom * 1000)
      const index = monthArrays.findIndex(item => Number(item) === month)
      const monthName = moment(month, 'M').format('MMMM');
      if(index === -1) {
        chartData.push(0)
      } else {
        chartData.push(data[monthName])
      }
      labels.push(monthName)
      dateFrom = getNumberOfMonthForward(dateFrom * 1000, 1).unix()
    }
    const dataSets = [
      {
        label: chartBar.name,
        backgroundColor: chartBar.color,
        borderColor: chartBar.color,
        hoverBackgroundColor: chartBar.color,
        borderWidth: 1,
        data: chartData,
        barPercentage: 0.5,
        categoryPercentage:  0.5,
        datalabels: {
          color: chartBar.color,
          font: {
            weight: 'bold'
          },
          formatter: customFormatter ? customFormatter : (value, context) => {
            const {dataIndex, dataset} = context
            if(dataIndex === 0 || dataset.data[dataIndex - 1] === 0) {
              return ''
            } else {
              value = Math.round(((value - dataset.data[dataIndex - 1]) / dataset.data[dataIndex - 1]) * 100)
              return value + '%'
            }
          }
        }
      },
    ]
    return {
      labels: labels,
      datasets: dataSets
    }
  }
}

export const createDumpDataIfMissing = (data, dateRange) => {
  if(data) {
    let { date_from, date_to } = dateRange
    date_from = moment(date_from*1000).unix()
    date_to = moment(date_to*1000).unix()
    const result = []
    while(date_from <= date_to) {
      const date = moment(date_from)
      const index = data.findIndex(item => moment(item.date).isSame(date, 'day'))
      if(index !== -1) {
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
  
      date_from = date_from + (24*3600000)
    }
  
    return result
  }
}
