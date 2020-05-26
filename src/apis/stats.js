import { BaseApiClient } from './base'

const GET_REPO_STATS_PATH = (repoId) => `/repositories/${repoId}/stats`

export default class StatsApiClient extends BaseApiClient {
  getRepoStats(repoId) {
    return this.httpClient.get(GET_REPO_STATS_PATH(repoId))
  }
}
