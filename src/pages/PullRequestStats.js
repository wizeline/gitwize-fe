import React, { useState, useEffect, useContext } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import Chart from '../components/Chart'
import BranchFilter from '../components/BranchFilter'
import PageTitle from '../components/PageTitle'
import TableData from '../components/TableData'
import { ApiClient } from '../apis'
import { transformRepositoryStatsApiResponse } from '../utils/apiUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'

const apiClient = new ApiClient()
const tabelColumn = ['Date', 'Merged', 'Rejected', 'Created']
const chartBars = ['Created', 'Rejected', 'Merged']

function PullRequestStats(props) {
  const [repoData, setRepoData] = useState([])
  const { authState } = useOktaAuth()
  const mainLayout = useContext(MainLayoutContex)
  const { id } = props.match.params

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    apiClient.stats.getRepoStats(id).then((data) => {
      mainLayout.handleChangeRepositoryId(id)
      setRepoData(transformRepositoryStatsApiResponse(data.metric))
    })
  }, [authState.accessToken, id, mainLayout])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>Pull Request Stats</PageTitle>
      <BranchFilter />
      <TableData tableData={repoData} tabelColumn={tabelColumn} />
      <Chart data={repoData} xAxis="Date" bars={chartBars} />
    </div>
  )
}

export default PullRequestStats
