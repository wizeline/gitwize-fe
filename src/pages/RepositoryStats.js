import React, { useState, useEffect, useContext, useRef } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import { transformMetricsDataApiResponse } from '../utils/apiUtils'
import { createReversedArray, transformToChartData, filterTableData} from '../utils/dataUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'
import PageContext from '../contexts/PageContext'
import DataStats from '../views/DataStats'

const apiClient = new ApiClient()
const tableColumn = ['Date', 'Commits', 'Additions', 'Deletions', 'Total lines of code', 'Change percent %']
const chartLines = [{name: 'Commits', color: '#5392FF'},
                    {name: 'Additions', color: '#62C8BA'}]
const chartBars = [{name: 'Deletions', color: '#DADADA'}]

function RepositoryStats(props) {
  const [repoData, setRepoData] = useState([])
  const [chartData, setChartData] = useState([])
  const { authState } = useOktaAuth()
  const [{ dateRange }] = useContext(PageContext)
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    apiClient.stats.getRepoStats(id, dateRange).then((data) => {
      mainLayout.current.handleChangeRepositoryId(id)
      const dataTransformed = transformMetricsDataApiResponse(data.metric, dateRange);
      const tableData = filterTableData(createReversedArray(dataTransformed), tableColumn);
      const chartData = transformToChartData(chartLines, chartBars, dataTransformed, 'Date')
      setRepoData(tableData);
      setChartData(chartData);
    })
  }, [authState.accessToken, id, mainLayout, dateRange])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>Repository Request Stats</PageTitle>
      <DataStats tableData={repoData} chartData={chartData} tableColumn={tableColumn}/>
    </div>
  )
}

export default RepositoryStats
