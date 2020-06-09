export const createReversedArray = (array) => {
  const reversedArray = array.reduce((acc, b) => [b, ...acc], [])

  return reversedArray
}

export const transformPeriodToDateRange = (period) => {
  const today =  new Date()
  let endDay = null
  if(period === 'Last 7 Days')
    endDay = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000))
  else if(period === 'Last 14 Days')
    endDay = new Date(today.getTime() - (14 * 24 * 60 * 60 * 1000))
  else if(period === 'Last 21 Days')
    endDay = new Date(today.getTime() - (21 * 24 * 60 * 60 * 1000))
  else if(period === 'Last 30 Days')
    endDay = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))

  return {
    period_date_from: endDay,
    period_date_to: today
  }
}

export const transformToChartData = (lines, bars, rawData, xAxis) => {
  let dataSets = [];
  const labels = rawData.flatMap(item => item[xAxis]);
  lines.forEach(chartItem => {
    const dataArray = rawData.flatMap(rawDataItem => rawDataItem[chartItem.name]);
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
      borderDash: chartItem.dash
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
      backgroundColor: chartItem.color,
      borderColor: chartItem.color,
      hoverBackgroundColor: chartItem.color,
      hoverBorderColor: chartItem.color,
    }
    dataSets.push(dataSetsItem);
  })
  return {
    labels: labels,
    datasets: dataSets
  }
}

export const filterTableData =  (tableData, tableColumn) => {
  return tableData.map((item) => {
    return Object.assign(...tableColumn.map((object) => ({[object]: item[object]})))
  })
}
