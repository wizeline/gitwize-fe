import { BaseApiClient } from './base'
import weeklyImpactResponse from '../mockData/WeeklyImpactData.json'

// const GET_WEEKLY_IMPACT_STATS_PATH = (repoId) => `/repositories/${repoId}/impact/weekly`

export default class WeeklyImpactApiClient extends BaseApiClient {
  getWeeklyImpactStats(repoId) {
    return Promise.resolve(weeklyImpactResponse)
    // return this.httpClient.get(GET_WEEKLY_IMPACT_STATS_PATH(repoId))
  }
}
