import { BaseApiClient } from './base'

const GET_WEEKLY_IMPACT_STATS_PATH = (repoId) => `/repositories/${repoId}/impact/weekly`

export default class WeeklyImpactApiClient extends BaseApiClient {
  getWeeklyImpactStats(repoId) {
    return this.httpClient.get(GET_WEEKLY_IMPACT_STATS_PATH(repoId))
  }
}
