import { BaseApiClient } from './base'
import response from '../mockData/WeeklyImpactData.json'

// const GET_WEEKLY_IMPACT_STATS_PATH = (repoId) => `/repositories/${repoId}/impact/weekly`

export default class WeeklyImpactApiClient extends BaseApiClient {
  getWeeklyImpactStats(repoId) {
    return Promise.resolve(response)
    // return this.httpClient.get(GET_WEEKLY_IMPACT_STATS_PATH(repoId))
  }
}
