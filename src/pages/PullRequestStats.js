import React, { useState, useEffect, useContext, useRef } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import { transformMetricsDataApiResponse } from '../utils/apiUtils'
import { transformToChartData } from '../utils/dataUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'
import DataStats from '../views/DataStats'
import PageContext from '../contexts/PageContext'

const apiClient = new ApiClient()
const tableColumn = ['Date', 'Merged', 'Rejected', 'Created']
const chartBars = [{name: 'Created', color: '#EC5D5C'}, {name: 'Rejected', color: '#DADADA'}, {name: 'Merged', color: '#5392FF'}]

function PullRequestStats(props) {
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
      const tranformedData = transformMetricsDataApiResponse(data.metric, dateRange);
      const chartData = transformToChartData([], chartBars, tranformedData, 'Date')
      setChartData(chartData);
      setRepoData(tranformedData)
    })
  }, [authState.accessToken, id, mainLayout, dateRange])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>Pull Request Stats</PageTitle>
      <DataStats tableData={repoData} chartData={chartData}
                    tableColumn={tableColumn}/>
    </div>
  )
}

export default PullRequestStats
