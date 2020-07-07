import { BaseApiClient } from './base'
import codeChangeVelocityRespond from '../mockData/CodeChangeVelocity.json'

const GET_CODECHANGE_VELOCITY_STATS_PATH = (repoId) => `/repositories/${repoId}/code-velocity`

export default class CodeChangeVelocityStatsApiClient extends BaseApiClient {
  getCodeChangeVelocityStats(repoId, dateRange) {
    return this.httpClient.get(GET_CODECHANGE_VELOCITY_STATS_PATH(repoId), { queryParams: dateRange})
    //return this.httpClient.get(GET_CONTRIBUTOR_STATS_PATH(repoId))
  }
}
