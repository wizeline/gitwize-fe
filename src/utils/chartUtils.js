import Papa from 'papaparse'

export const readDataFromFile = filePath => {
  return new Promise(resolve => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete(result) {
        resolve(result.data)
      }
    })
  })
}

export const getChartColor = data => {
  switch (data) {
    case 'Commits':
      return '#000000'
    case 'Additions':
      return '#00000052'
    case 'Deletions':
      return '#0000008f'
    case 'Pull requests':
      return '#0000008f'
    case 'Total lines of code':
      return '#00000052'
    default:
      return '#000000'
  }
}
