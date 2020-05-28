import { readDataFromFile } from '../utils/chartUtils'

export const fetchRepositoryStatsDataFromFile = async (fileName) => {
  const data = await readDataFromFile(fileName)
  return data
}

export const fetchBranchesFromServer = () => {
  return fetch('https://5eb2736b36d3ee001682e879.mockapi.io/api/v1/repositories/branches')
    .then((res) => res.json())
    .then((res) => {
      return res.metrics
    })
}
