import { readDataFromFile } from '../utils/chartUtils'
import { transformRepositoryStatsApiResponse } from '../utils/apiUtils'

export const fetchRepositoryStatsDataFromFile = async (fileName) => {
  const data = await readDataFromFile(fileName)
  return data
}

export const fetchRepositoryStatsDataFromServer = () => {
  return fetch('https://5eb2736b36d3ee001682e879.mockapi.io/qapi/v1/repositories/stats')
    .then((res) => res.json())
    .then((res) => {
      return transformRepositoryStatsApiResponse(res.metrics)
    })
}
