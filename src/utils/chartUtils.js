import Papa from 'papaparse'
import {cloneDeep} from 'lodash'

export const readDataFromFile = (filePath) => {
  return new Promise((resolve) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete(result) {
        resolve(result.data)
      },
    })
  })
}

export const getChartColor = (data) => {
  switch (data) {
    case 'Commits':
    case 'Merged':
      return '#000000'
    case 'Additions':
    case 'Rejected':
      return '#00000052'
    case 'Deletions':
    case 'Created':
      return '#0000008f'
    case 'Pull requests':
      return '#0000008f'
    case 'Total lines of code':
      return '#00000052'
    default:
      return '#000000'
  }
}

export const getChartOptions = (chartOptions, chartLines = []) => {
  let newChartOptions = cloneDeep(chartOptions)
  if(chartLines.length > 0) {
    chartLines.forEach(item => {
      const yAxisItem = {
        type: 'linear',
        display: true,
        position: 'right',
        id: item.yAxisId,
        gridLines: {
          display: false
        },
        labels: {
          show: true
        },
        stacked: true,
        ticks: {
          fontColor: item.color,
          fontSize: 10,
          beginAtZero: true,
          precision: 0,
          suggestedMax: 10
        }
      }
      newChartOptions.scales.yAxes.push(yAxisItem);
    })
  }
  return newChartOptions
}
