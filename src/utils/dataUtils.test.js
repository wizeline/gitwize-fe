import { createReversedArray, transformPeriodToDateRange, transformToChartData, filterTableData, convertTableObjectToTableColumn } from './dataUtils'

describe('createReversedArray', () => {
  const mockedData = [
    { Additions: 1111, Commits: 111, Created: 111, Date: '4/15/2020', Deletions: 1111 },
    { Additions: 2222, Commits: 222, Created: 222, Date: '4/16/2020', Deletions: 2222 },
    { Additions: 3333, Commits: 333, Created: 333, Date: '4/17/2020', Deletions: 3333 },
    { Additions: 4444, Commits: 444, Created: 444, Date: '4/18/2020', Deletions: 4444 },
    { Additions: 5555, Commits: 555, Created: 555, Date: '4/19/2020', Deletions: 5555 },
    { Additions: 6666, Commits: 666, Created: 666, Date: '4/120/2020', Deletions: 6666 },
  ]

  test('Create instace of Array', () => {
    expect(createReversedArray(mockedData)).toBeInstanceOf(Array)
  })

  test('Return enough data', () => {
    expect(createReversedArray(mockedData).length).toBe(6)
  })

  test('Return correct data', () => {
    const reversedArray = createReversedArray(mockedData)
    expect(Object.values(reversedArray)[0].Additions).toBe(6666)
    expect(Object.values(reversedArray)[0].Commits).toBe(666)
    expect(Object.values(reversedArray)[0].Created).toBe(666)
    expect(Object.values(reversedArray)[0].Date).toBe('4/120/2020')
    expect(Object.values(reversedArray)[0].Deletions).toBe(6666)
  })
})

describe('transformPeriodToDateRange', () => {
  const period = {
    last7days: 'Last 7 Days',
    last14days: 'Last 14 Days',
    last21days: 'Last 21 Days',
    last30days: 'Last 30 Days',
  }

  test('Create instance of object', () => {
    expect(transformPeriodToDateRange(period.last7days)).toBeInstanceOf(Object)
  })

  test('Create valid data', () => {
    const last7daysDateRange = transformPeriodToDateRange(period.last7days)
    const key = Object.keys(last7daysDateRange)
    expect(key[0]).toBe('period_date_from')
    expect(key[1]).toBe('period_date_to')
  })


  test('Create correct data', () => {
    const today = new Date()
    const _7DaysAgo = new Date(today.getTime() - (6 * 24 * 60 * 60 * 1000))
    const _14DaysAgo = new Date(today.getTime() - (13 * 24 * 60 * 60 * 1000))
    const _21DaysAgo = new Date(today.getTime() - (20 * 24 * 60 * 60 * 1000))
    const _30DaysAgo = new Date(today.getTime() - (29 * 24 * 60 * 60 * 1000))


    const last7DaysRange = transformPeriodToDateRange(period.last7days)
    expect(last7DaysRange.period_date_from.toDateString()).toStrictEqual(_7DaysAgo.toDateString())
    expect(last7DaysRange.period_date_to.toDateString()).toStrictEqual(today.toDateString())

    const last14DaysRange = transformPeriodToDateRange(period.last14days)
    expect(last14DaysRange.period_date_from.toDateString()).toStrictEqual(_14DaysAgo.toDateString())
    expect(last14DaysRange.period_date_to.toDateString()).toStrictEqual(today.toDateString())

    const last21DaysRange = transformPeriodToDateRange(period.last21days)
    expect(last21DaysRange.period_date_from.toDateString()).toStrictEqual(_21DaysAgo.toDateString())
    expect(last21DaysRange.period_date_to.toDateString()).toStrictEqual(today.toDateString())

    const last30DaysRange = transformPeriodToDateRange(period.last30days)
    expect(last30DaysRange.period_date_from.toDateString()).toStrictEqual(_30DaysAgo.toDateString())
    expect(last30DaysRange.period_date_to.toDateString()).toStrictEqual(today.toDateString())
  
  })
})

describe('transformToChartData', () => {
  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    }
  ]

  const chartLines = [{name: 'uv'}]
  const chartBars = [{name: 'pv'}]

  test('Create instance of object', () => {
    expect(transformToChartData(chartLines, chartBars, data, 'name')).toBeInstanceOf(Object)
  })

  test('Create correct data', () => {
    const chartData = transformToChartData(chartLines, chartBars, data, 'name')
    expect(chartData.labels.length).toBe(4)
    expect(chartData.datasets.length).toBe(2)
    expect(chartData.datasets[0].type).toBe('line')
    expect(chartData.datasets[1].type).toBe('bar')
  })
})

describe('filterTableData', () => {
  const tableColumn = [{text: 'Header 1', fieldName: 'Header 1'}, {text: 'Header 2', fieldName: 'Header 2'}]
  const tableData = [{
    'Header 1': 'Value 11',
    'Header 2': 'Value 12',
    'Header 3': 'Value 13'
  },
  {
    'Header 1': 'Value 21',
    'Header 2': 'Value 22',
    'Header 3': 'Value 23'
  }]

  test('Create instance of object', () => {
    expect(filterTableData(tableData, tableColumn)).toBeInstanceOf(Object)
  })

  test('Create correct data', () => {
    const newTableData = filterTableData(tableData, tableColumn)
    expect(newTableData.length).toBe(2)
    expect(newTableData[0]['Header 3']).toBe(undefined)
    expect(newTableData[0]['Header 1']).toBe('Value 11')
  })
})

describe('transformToChartData', () => {
  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    }
  ]

  const chartLines = [{name: 'uv'}]
  const chartBars = [{name: 'pv'}]

  test('Create instance of object', () => {
    expect(transformToChartData(chartLines, chartBars, data, 'name')).toBeInstanceOf(Object)
  })

  test('Create correct data', () => {
    const chartData = transformToChartData(chartLines, chartBars, data, 'name')
    expect(chartData.labels.length).toBe(4)
    expect(chartData.datasets.length).toBe(2)
    expect(chartData.datasets[0].type).toBe('line')
    expect(chartData.datasets[1].type).toBe('bar')
  })
})

describe('convertTableObjectToTableColumn', () => {
  const tableObject = [
    {text: 'Date', fieldName: 'Date'},
    {text: 'Merged', fieldName: 'Commits', type: 'numeric'}, 
    {text: 'Rejected', fieldName: 'Additions', type: 'numeric'}, 
    {text: 'Created', fieldName: 'Deletions', type: 'numeric'},
  ]

  test('Create instance of object', () => {
    expect(convertTableObjectToTableColumn(tableObject)).toBeInstanceOf(Object)
  })

  test('Create correct data', () => {
    const tableColumns = convertTableObjectToTableColumn(tableObject)
    expect(tableColumns.length).toBe(4)
    expect(tableColumns[0]['title']).toBe('Date')
    expect(tableColumns[1]['title']).toBe('Merged')
    expect(tableColumns[2]['title']).toBe('Rejected')
    expect(tableColumns[3]['title']).toBe('Created')
  })
})