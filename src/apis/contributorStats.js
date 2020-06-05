import { BaseApiClient } from './base'
import contributorsStatsRespond from '../mockData/contributorData.json'
import contributorByDate from '../mockData/ContributorByDate.json' 

// const GET_CONTRIBUTOR_STATS_PATH = (repoId) => `/repositories/${repoId}/stats`

export default class ContributorStatsApiClient extends BaseApiClient {
  getContributorStats(repoId) {
      return Promise.resolve(contributorsStatsRespond);
    //return this.httpClient.get(GET_CONTRIBUTOR_STATS_PATH(repoId))
  }
  getContributorChartDataStats(repoId) {
    return Promise.resolve(contributorByDate);
  //return this.httpClient.get(GET_CONTRIBUTOR_STATS_PATH(repoId))
}
}
