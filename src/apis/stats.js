import { BaseApiClient } from './base'
import { convertDateToSecond } from '../utils/apiUtils'

const GET_REPO_STATS_PATH = (repoId) => `/repositories/${repoId}/stats`

export default class StatsApiClient extends BaseApiClient {
  getRepoStats(repoId, dateRange) {
    const formatDateRange = {
      date_from: convertDateToSecond(dateRange.date_from),
      date_to: convertDateToSecond(dateRange.date_to)
    }
    return this.httpClient.get(GET_REPO_STATS_PATH(repoId), { queryParams: formatDateRange})
  }
}
