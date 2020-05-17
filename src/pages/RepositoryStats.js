import React, { useState, useEffect } from 'react'
import Chart from '../components/Chart'
import { readDataFromFile } from '../utils/chartUtils'

const fileName = 'GITStats.csv'

function RepositoryStats() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    readDataFromFile(fileName).then((data) => setChartData(data))
  }, [])

  return (
    <div>
      <Chart
        data={chartData}
        xAxis="Date"
        lines={['Commits', 'Additions', 'Deletions']}
        bars={['Total lines of code', 'Pull requests']}
      />
    </div>
  )
}

export default RepositoryStats
