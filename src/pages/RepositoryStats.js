import React, { useState, useEffect, useContext } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import Chart from '../components/Chart'
import BranchFilter from '../components/BranchFilter'
import PageTitle from '../components/PageTitle'
import TableData from '../components/TableData'
import { ApiClient } from '../apis'
import { createReversedArray } from '../utils/dataUtils'
import { transformRepositoryStatsApiResponse } from '../utils/apiUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'

const apiClient = new ApiClient()
const tabelColumn = ['Date', 'Commits', 'Additions', 'Deletions', 'Total lines of code', 'Change percent %']
const chartLines = ['Commits', 'Additions']
const chartBars = ['Total lines of code', 'Deletions']

function RepositoryStats(props) {
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
      <PageTitle>Repository Request Stats</PageTitle>
      <BranchFilter />
      <TableData tableData={repoData} tabelColumn={tabelColumn} />
      <Chart data={createReversedArray(repoData)} xAxis="Date" lines={chartLines} bars={chartBars} />
    </div>
  )
}

export default RepositoryStats
