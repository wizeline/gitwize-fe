import { BaseApiClient } from './base'

const GET_CODEQUALITY_STATS_PATH = (repoId) => `/repositories/${repoId}/code-quality`

export default class CodeQualityStatsApiClient extends BaseApiClient {
  getCodeQualityStats(repoId) {
    return this.httpClient.get(GET_CODEQUALITY_STATS_PATH(repoId))
  }
}
