import { BaseApiClient } from './base'
import { convertDateToSecond } from '../utils/apiUtils'

const GET_CONTRIBUTOR_STATS_PATH = (repoId) => `/repositories/${repoId}/contributor`

export default class ContributorStatsApiClient extends BaseApiClient {
  getContributorStats(repoId, dateRange) {
    const formatDateRange = {
      date_from: convertDateToSecond(dateRange.date_from),
      date_to: convertDateToSecond(dateRange.date_to)
    }
    return this.httpClient.get(GET_CONTRIBUTOR_STATS_PATH(repoId), { queryParams: formatDateRange})
  }
}
