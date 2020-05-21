import React, { useState, useEffect } from 'react'

import Chart from '../components/Chart'
import { fetchRepositoryStatsDataFromServer } from '../services/dataFetchingService'
import BranchFilter from '../components/BranchFilter'
import PageTitle from '../components/PageTitle'
import TableData from '../components/TableData'

function RepositoryStats() {
  const [repoData, setRepoData] = useState([])

  useEffect(() => {
    fetchRepositoryStatsDataFromServer().then(data => setRepoData(data))
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>membership-web-view</PageTitle>
      <BranchFilter />
      <TableData tableData={repoData} show={["Date", "Commits", "Additions", "Deletions", "Total lines of code"]}/>
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
        lines={['Merged']}
        bars={['Created', 'Rejected']}
      />
    </div>
  )
}

export default RepositoryStats
