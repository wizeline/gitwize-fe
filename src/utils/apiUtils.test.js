import { transformMetricsDataApiResponse, getRepositoryNameFromGitHubUrl } from './apiUtils'
import { data } from './data'

// from 6/3/2020 to 6/1/2020
const toDate = new Date('6/3/2020')
const fromDate = new Date('6/1/2020')

const dateRange = {
  date_from: fromDate,
  date_to: toDate
}

describe('transformRepositoryStatsApiResponse', () => {
  test('Create instace of Array', () => {
    expect(transformMetricsDataApiResponse(data, dateRange)).toBeInstanceOf(Array)
  })

  test('Return enough data', () => {
    expect(transformMetricsDataApiResponse(data, dateRange).length).toBe(3)
  })

  test('Return correct data', () => {
    expect(Object.values(transformMetricsDataApiResponse(data, dateRange))[0].Date).toBe('6/1/2020')
  })

  test('Value is within the object', () => {
    const transformedData = transformMetricsDataApiResponse(data, dateRange)

    expect(Object.values(transformedData)[0].Commits).toBe(1234)
    expect(Object.values(transformedData)[0].Additions).toBe(1000)
    expect(Object.values(transformedData)[0].Deletions).toBe(1000)
    expect(Object.values(transformedData)[0].Merged).toBe(1200)
    expect(Object.values(transformedData)[0].Open).toBe(1304)
    expect(Object.values(transformedData)[0].Rejected).toBe(1200)
  })

  test('Missing field will be replaced by 0', () => {
    delete data.loc[0]
    delete data.lines_added[0]
    delete data.commits[1]
    delete data.lines_removed[1]
    const transformedData = transformMetricsDataApiResponse(data, dateRange)

    expect(Object.values(transformedData)[0].Additions).toBe(0)
    expect(Object.values(transformedData)[1].Commits).toBe(0)
    expect(Object.values(transformedData)[1].Deletions).toBe(0)
  })
})

describe('getRepositoryNameFromGitHubUrl', () => {
  test('Return reponame from github url', () => {
    const url = "https://github.com/thinguyenwizeline/wizeline-nightwatch-automation.git"

    expect(getRepositoryNameFromGitHubUrl(url)).toBe("wizeline-nightwatch-automation")
  })

  test('Invalid github url', () => {
    const url = "wizeline_academy"

    expect(getRepositoryNameFromGitHubUrl(url)).toBe(url)
  })

  test('GitHub URL with SSH format', () => {
    const url = "git@github.com:wizeline/gitwize-fe.git"

    expect(getRepositoryNameFromGitHubUrl(url)).toBe("gitwize-fe")
  })

  test('URL without .git', () => {
    const urlHttp = "https://github.com/thinguyenwizeline/wizeline-nightwatch-automation.git" 
    
    expect(getRepositoryNameFromGitHubUrl(urlHttp)).toBe("wizeline-nightwatch-automation")
  })
})
