import React, { useState, useEffect } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import Chart from '../components/Chart'
import BranchFilter from '../components/BranchFilter'
import PageTitle from '../components/PageTitle'
import TableData from '../components/TableData'
import { ApiClient } from '../apis' 
import { transformRepositoryStatsApiResponse } from '../utils/apiUtils'

const apiClient = new ApiClient() 

function RepositoryStats() {
  const [repoData, setRepoData] = useState([])
  const { authState } = useOktaAuth()

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    apiClient.stats.getRepoStats(1).then(data => {setRepoData(transformRepositoryStatsApiResponse(data.metric))})
  }, [authState.accessToken])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>membership-web-view</PageTitle>
      <BranchFilter />
      <TableData tableData={repoData} show={["Date", "Commits", "Additions", "Deletions", "Total lines of code", "Change percent %"]}/>
      <Chart
        data={repoData}
        xAxis="Date"
        lines={['Commits', 'Additions']}
        bars={['Total lines of code', 'Deletions']}
      />
      <TableData tableData={repoData} show={["Date", "Merged", "Rejected", "Created"]}/>
      <Chart
        data={repoData}
        xAxis="Date"
        bars={['Created', 'Rejected', 'Merged']}
      />
    </div>
  )
}

export default RepositoryStats
