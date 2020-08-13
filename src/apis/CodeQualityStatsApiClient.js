import { BaseApiClient } from './base'
import response from '../mockData/CodeQualityData.json'

// const GET_CODEQUALITY_STATS_PATH = (repoId) => `/repositories/${repoId}/code-quality`

export default class CodeQualityStatsApiClient extends BaseApiClient {
  getCodeQualityStats(repoId) {
    return Promise.resolve(response)
    // return this.httpClient.get(GET_CODEQUALITY_STATS_PATH(repoId))
  }
}
