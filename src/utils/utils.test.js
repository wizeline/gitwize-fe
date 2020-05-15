import { transformRepositoryStatsApiResponse } from './apiUtils'

const data = {
  loc: [
    {
      branch: 'master',
      value: 2000,
      asOfDate: '12/10/2020',
    },
    {
      branch: 'master',
      value: 2301,
      asOfDate: '13/10/2020',
    },
    {
      branch: 'master',
      value: 1202,
      asOfDate: '14/10/2020',
    },
    {
      branch: 'master',
      value: 1003,
      asOfDate: '15/10/2020',
    },
    {
      branch: 'master',
      value: 1464,
      asOfDate: '16/10/2020',
    },
    {
      branch: 'master',
      value: 2125,
      asOfDate: '17/10/2020',
    },
    {
      branch: 'master',
      value: 2345,
      asOfDate: '18/10/2020',
    },
    {
      branch: 'master',
      value: 2543,
      asOfDate: '19/10/2020',
    },
  ],
  lines_added: [
    {
      branch: 'master',
      value: 1000,
      asOfDate: '10/10/2020',
    },
    {
      branch: 'master',
      value: 1300,
      asOfDate: '11/10/2020',
    },
    {
      branch: 'master',
      value: 2300,
      asOfDate: '12/10/2020',
    },
    {
      branch: 'master',
      value: 2050,
      asOfDate: '13/10/2020',
    },
    {
      branch: 'master',
      value: 1032,
      asOfDate: '14/10/2020',
    },
    {
      branch: 'master',
      value: 1302,
      asOfDate: '15/10/2020',
    },
    {
      branch: 'master',
      value: 1201,
      asOfDate: '16/10/2020',
    },
    {
      branch: 'master',
      value: 1111,
      asOfDate: '17/10/2020',
    },
    {
      branch: 'master',
      value: 2222,
      asOfDate: '18/10/2020',
    },
  ],
  lines_removed: [
    {
      branch: 'master',
      value: 1000,
      asOfDate: '10/10/2020',
    },
    {
      branch: 'master',
      value: 1300,
      asOfDate: '11/10/2020',
    },
    {
      branch: 'master',
      value: 2300,
      asOfDate: '12/10/2020',
    },
    {
      branch: 'master',
      value: 2050,
      asOfDate: '13/10/2020',
    },
    {
      branch: 'master',
      value: 1032,
      asOfDate: '14/10/2020',
    },
    {
      branch: 'master',
      value: 1302,
      asOfDate: '15/10/2020',
    },
    {
      branch: 'master',
      value: 1201,
      asOfDate: '16/10/2020',
    },
    {
      branch: 'master',
      value: 1111,
      asOfDate: '17/10/2020',
    },
    {
      branch: 'master',
      value: 2222,
      asOfDate: '18/10/2020',
    },
  ],
  commits: [
    {
      branch: 'master',
      value: 1234,
      asOfDate: '10/10/2020',
    },
    {
      branch: 'master',
      value: 1302,
      asOfDate: '11/10/2020',
    },
    {
      branch: 'master',
      value: 2400,
      asOfDate: '12/10/2020',
    },
    {
      branch: 'master',
      value: 1050,
      asOfDate: '13/10/2020',
    },
    {
      branch: 'master',
      value: 1232,
      asOfDate: '14/10/2020',
    },
    {
      branch: 'master',
      value: 1802,
      asOfDate: '15/10/2020',
    },
    {
      branch: 'master',
      value: 1601,
      asOfDate: '16/10/2020',
    },
    {
      branch: 'master',
      value: 1411,
      asOfDate: '17/10/2020',
    },
    {
      branch: 'master',
      value: 2322,
      asOfDate: '18/10/2020',
    },
  ],
  prs: [
    {
      branch: 'master',
      value: 1200,
      asOfDate: '10/10/2020',
    },
    {
      branch: 'master',
      value: 1800,
      asOfDate: '11/10/2020',
    },
    {
      branch: 'master',
      value: 2700,
      asOfDate: '12/10/2020',
    },
    {
      branch: 'master',
      value: 2650,
      asOfDate: '13/10/2020',
    },
    {
      branch: 'master',
      value: 1432,
      asOfDate: '14/10/2020',
    },
    {
      branch: 'master',
      value: 1302,
      asOfDate: '15/10/2020',
    },
    {
      branch: 'master',
      value: 1209,
      asOfDate: '16/10/2020',
    },
    {
      branch: 'master',
      value: 1181,
      asOfDate: '17/10/2020',
    },
    {
      branch: 'master',
      value: 2221,
      asOfDate: '18/10/2020',
    },
  ],
}

describe('transformRepositoryStatsApiResponse', () => {
  test('Create instace of Array', () => {
    expect(transformRepositoryStatsApiResponse(data)).toBeInstanceOf(Array)
  })

  test('Return enough data', () => {
    expect(transformRepositoryStatsApiResponse(data).length).toBe(10)
  })

  test('Return correct data', () => {
    expect(Object.values(transformRepositoryStatsApiResponse(data))[0].asOfDate).toBe('12/10/2020')
  })

  test('Value is within the object', () => {
    const transformedData = transformRepositoryStatsApiResponse(data)

    expect(Object.values(transformedData)[0].Commits).toBe(2400)
    expect(Object.values(transformedData)[0].Additions).toBe(2300)
    expect(Object.values(transformedData)[0].Deletions).toBe(2300)
    expect(Object.values(transformedData)[0]['Total lines of code']).toBe(2000)
    expect(Object.values(transformedData)[0]['Pull requests']).toBe(2700)
  })
})
