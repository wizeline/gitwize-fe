import { BaseApiClient } from './base'

const GET_TRENDS_STATS_PATH = (repoId) => `/repositories/${repoId}/trends`

export default class QuarterlyTrendsStatsApiClient extends BaseApiClient {
  getQuarterlyTrendsStats(repoId, dateRange) {
      return this.httpClient.get(GET_TRENDS_STATS_PATH(repoId), { queryParams: dateRange})
  }
}
