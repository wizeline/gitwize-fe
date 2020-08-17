import { BaseApiClient } from './base'
import { convertDateToSecond } from '../utils/apiUtils'

const GET_WEEKLY_IMPACT_STATS_PATH = (repoId) => `/repositories/${repoId}/impact/weekly`

export default class WeeklyImpactApiClient extends BaseApiClient {
  getWeeklyImpactStats(repoId, dateRange) {
    const formatDateRange = {
      date_from: convertDateToSecond(dateRange.from),
      date_to: convertDateToSecond(dateRange.to),
    }
    return this.httpClient.get(GET_WEEKLY_IMPACT_STATS_PATH(repoId), { queryParams: formatDateRange })
  }
}
