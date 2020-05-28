import { filterObjectByKey } from './dataUtils'
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
