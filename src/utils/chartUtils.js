import Papa from 'papaparse'

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

export const getChartOptions = (chartOptions) => {
  return {
    ...chartOptions,
    responsive: true,
    tooltips: {
      mode: 'label',
      bodySpacing: 10,
      titleMarginBottom: 10,
      titleFontSize: 14,
      titleFontStyle: 'bold',
      footerAlign: 'right',
      callbacks: {
        label: (tooltipItem, data) => {
          const label = data.datasets[tooltipItem.datasetIndex].label || ''
          const value = tooltipItem.value
          return `   ${label}: ${value}`
        }
      }
    },
    elements: {
      line: {
        fill: false
      }
    },
    legend: {
      position: 'bottom'
    }
  }
}
