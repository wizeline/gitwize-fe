import { BaseApiClient } from './base'
import { convertDateToSecond } from '../utils/apiUtils'

const GET_PULL_REQUEST_SIZE_PATH = (repoId) => `/repositories/${repoId}/pullrequest-size`

export default class PullRequestSizeApiClient extends BaseApiClient {
  getPullRequestSize(repoId, dateRange) {
    const formatDateRange = {
      date_from: convertDateToSecond(dateRange.date_from),
      date_to: convertDateToSecond(dateRange.date_to)
    }
    return this.httpClient.get(GET_PULL_REQUEST_SIZE_PATH(repoId), { queryParams: formatDateRange })
  }
}
