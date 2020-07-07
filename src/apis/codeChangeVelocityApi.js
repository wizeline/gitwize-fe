import { BaseApiClient } from './base'

const GET_CODECHANGE_VELOCITY_STATS_PATH = (repoId) => `/repositories/${repoId}/code-velocity`

export default class CodeChangeVelocityStatsApiClient extends BaseApiClient {
  getCodeChangeVelocityStats(repoId, dateRange) {
    return this.httpClient.get(GET_CODECHANGE_VELOCITY_STATS_PATH(repoId), { queryParams: dateRange})
  }
}
