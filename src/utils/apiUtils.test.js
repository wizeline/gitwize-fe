import { transformRepositoryStatsApiResponse, getRepositoryNameFromGitHubUrl } from './apiUtils'
import { data } from './data'

describe('transformRepositoryStatsApiResponse', () => {
  test('Create instace of Array', () => {
    expect(transformRepositoryStatsApiResponse(data)).toBeInstanceOf(Array)
  })

  test('Return enough data', () => {
    expect(transformRepositoryStatsApiResponse(data).length).toBe(3)
  })

  test('Return correct data', () => {
    expect(Object.values(transformRepositoryStatsApiResponse(data))[0].Date).toBe('4/29/2020')
  })

  test('Value is within the object', () => {
    const transformedData = transformRepositoryStatsApiResponse(data)

    expect(Object.values(transformedData)[0].Commits).toBe(1234)
    expect(Object.values(transformedData)[0].Additions).toBe(1000)
    expect(Object.values(transformedData)[0].Deletions).toBe(1000)
    expect(Object.values(transformedData)[0]['Total lines of code']).toBe(2000)
    expect(Object.values(transformedData)[0].Merged).toBe(1200)
    expect(Object.values(transformedData)[0].Created).toBe(1304)
    expect(Object.values(transformedData)[0].Rejected).toBe(1200)
  })

  test('Missing field will be replaced by 0', () => {
    delete data.loc[0]
    delete data.lines_added[0]
    delete data.commits[1]
    delete data.lines_removed[1]
    const transformedData = transformRepositoryStatsApiResponse(data)

    expect(Object.values(transformedData)[0]['Total lines of code']).toBe(0)
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
})
