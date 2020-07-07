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
  if(chartLines.length > 0 && newChartOptions) {
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

export const buildChartOptionsBasedOnMaxValue = (chartData) => {
  if(chartData) {
    const chartValue = Object.values(chartData)
    let maxValue = 0
    if(chartValue && chartValue.length !== 0) {
      maxValue = chartValue.reduce((a, b) => {
        return Math.max(a, b);
      })
    }
    return  {
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              display: true,
              drawTicks: false,
              drawOnChartArea: false,
            },
            stacked: false,
            ticks: {
              fontColor: "#C4C4C4",
              fontSize: 10,
              autoSkip: true,
              autoSkipPadding: 30
            }
          }
        ],
        yAxes: [
          {
            type: 'linear',
            display: false,
            position: 'left',
            id: 'y-axis-1',
            gridLines: {
              display: false
            },
            labels: {
              show: false
            },
            stacked: false,
            ticks: {
              fontColor: "#C4C4C4",
              fontSize: 10,
              beginAtZero: true,
              min: 0,
              max: (maxValue + (maxValue/2)),
              precision: 0,
              suggestedMax: 5
            }
          }
        ]
      },
      tooltips: {
        enabled: false
      },
      plugins: {
        datalabels: {
            anchor: 'end',
            align: 'right',
            offset: 11,
            font: {
              size: 13
            }
        }
      },
      maintainAspectRatio: false,
    }
  }
  return null
}
