import { BaseApiClient } from './base'

const GET_REPO_DETAIL_PATH = (repoId) => `/repositories/${repoId}`
const CREATE_REPO_PATH = '/repositories/'
const UPDATE_REPO_PATH = (repoId) => `/repositories/${repoId}`
const DELETE_REPO_PATH = (repoId) => `/repositories/${repoId}`
const LIST_REPO_PATH = `/repositories/`

export default class ReposApiClient extends BaseApiClient {
  getRepoDetail(repoId) {
    return this.httpClient.get(GET_REPO_DETAIL_PATH(repoId))
  }

  createRepo(repoDetail) {
    return this.httpClient.post(CREATE_REPO_PATH, { body: repoDetail })
  }

  updateRepo(repoDetail) {
    return this.httpClient.put(UPDATE_REPO_PATH(repoDetail.id), { body: repoDetail })
  }

  deleteRepo(repoId) {
    return this.httpClient.delete(DELETE_REPO_PATH(repoId))
  }

  listRepo() {
    return this.httpClient.get(LIST_REPO_PATH)
  }
}
