import { filterObjectByKey, createReversedArray } from './dataUtils'
import { transformRepositoryStatsApiResponse } from './apiUtils'
import { data } from './data'

describe('filterObjectByKey', () => {
  const transformedData = transformRepositoryStatsApiResponse(data)

  test('Create instace of Array', () => {
    expect(filterObjectByKey(transformedData, ['Commits', 'Merged', 'Rejected'])).toBeInstanceOf(Array)
  })

  test('Return enough data', () => {
    expect(filterObjectByKey(transformedData, ['Commits', 'Merged', 'Rejected']).length).toBe(3)
    expect(filterObjectByKey(transformedData, ['Deletions', 'Additions', 'Total lines of code']).length).toBe(3)
  })

  test('Value is within the object', () => {
    const filteredData = filterObjectByKey(transformedData, ['Merged', 'Additions', 'Deletions', 'Rejected'])

    expect(Object.values(filteredData)[0].Merged).toBe(1200)
    expect(Object.values(filteredData)[0].Additions).toBe(1000)
    expect(Object.values(filteredData)[0].Deletions).toBe(1000)
    expect(Object.values(filteredData)[0].Rejected).toBe(1200)
    expect(Object.values(filteredData)[0].Commits).toBe(undefined)
    expect(Object.values(filteredData)[0].Created).toBe(undefined)
  })
})

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
