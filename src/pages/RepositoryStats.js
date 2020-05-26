import React, { useState, useEffect } from 'react'

import Chart from '../components/Chart'
import { fetchRepositoryStatsDataFromServer } from '../services/dataFetchingService'
import BranchFilter from '../components/BranchFilter'
import PageTitle from '../components/PageTitle'

function RepositoryStats() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    fetchRepositoryStatsDataFromServer().then(data => setChartData(data))
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>membership-web-view</PageTitle>
      <BranchFilter />
      <Chart
        data={chartData}
        xAxis="asOfDate"
        lines={['Commits', 'Additions', 'Deletions']}
        bars={['Total lines of code', 'Pull requests']}
      />
    </div>
  )
}

export default RepositoryStats
