import * as moment from 'moment'

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
      lineTension: 0.001
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
      }
    }
    dataSets.push(dataSetsItem);
  })
  return {
    labels: labels,
    datasets: dataSets
  }
}

export const filterTableData =  (tableData = [], tableColumn) => {
  return tableData.map((item) => {
    if(item['Date']) {
      item['Date'] = moment(item['Date']).format(dateFormat)
    }
    return Object.assign(...tableColumn.map((object) => ({[object.text]: item[object.fieldName]})))
  })
}

export const convertTableObjectToTableColumn =  (tableObject) => {
  return tableObject.flatMap(item => ({
    title: item.text,
    field: item.text,
    type: (item.type) ? item.type : 'string',
    searchable: item.searchable ? true : false,
    cellStyle: item.cellStyle
  }))
}
