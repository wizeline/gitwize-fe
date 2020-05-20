import React, { useState, useEffect } from 'react'

import Chart from '../components/Chart'
import { fetchRepositoryStatsDataFromServer } from '../services/dataFetchingService'
import BranchFilter from '../components/BranchFilter'
import PageTitle from '../components/PageTitle'
import TableData from '../components/TableData'

function RepositoryStats() {
  const [branchData, setBranchData] = useState([])

  useEffect(() => {
    fetchRepositoryStatsDataFromServer().then(data => setBranchData(data))
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>membership-web-view</PageTitle>
      <BranchFilter />
      <TableData data={branchData}/>
      <Chart
        data={branchData}
        xAxis="Date"
        lines={['Commits', 'Additions', 'Deletions']}
        bars={['Total lines of code', 'Pull requests']}
      />
    </div>
  )
}

export default RepositoryStats
