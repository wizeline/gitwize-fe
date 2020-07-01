import { BaseApiClient } from './base'
import codeChangeVelocityRespond from '../mockData/CodeChangeVelocity.json'

// const GET_CONTRIBUTOR_STATS_PATH = (repoId) => `/repositories/${repoId}/stats`

export default class CodeChangeVelocityStatsApiClient extends BaseApiClient {
  getCodeChangeVelocityStats(repoId, dateRange) {
      return Promise.resolve(codeChangeVelocityRespond);
    //return this.httpClient.get(GET_CONTRIBUTOR_STATS_PATH(repoId))
  }
}
