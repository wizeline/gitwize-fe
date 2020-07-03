import { BaseApiClient } from './base'
import quarterlyTrendsRespond from '../mockData/QuarterlyTrends.json'

// const GET_CONTRIBUTOR_STATS_PATH = (repoId) => `/repositories/${repoId}/stats`

export default class QuarterlyTrendsStatsApiClient extends BaseApiClient {
  getQuarterlyTrendsStats(repoId, dateRange) {
      return Promise.resolve(quarterlyTrendsRespond);
    //return this.httpClient.get(GET_CONTRIBUTOR_STATS_PATH(repoId))
  }
}
