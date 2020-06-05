import React, { useState, useEffect, useContext, useRef } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import { transformMetricsDataApiResponse } from '../utils/apiUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'
import DataStats from '../views/DataStats'
import PageContext from '../contexts/PageContext'

const apiClient = new ApiClient()
const tableColumn = ['Date', 'Merged', 'Rejected', 'Created']
const chartBars = ['Created', 'Rejected', 'Merged']

function PullRequestStats(props) {
  const [repoData, setRepoData] = useState([])
  const { authState } = useOktaAuth()
  const [{ dateRange }] = useContext(PageContext)
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    apiClient.stats.getRepoStats(id, dateRange).then((data) => {
      mainLayout.current.handleChangeRepositoryId(id)
      setRepoData(transformMetricsDataApiResponse(data.metric, dateRange))
    })
  }, [authState.accessToken, id, mainLayout, dateRange])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>Pull Request Stats</PageTitle>
      <DataStats tableData={repoData} chartData={repoData} xAxis={'Date'} 
                    tableColumn={tableColumn} chartBars={chartBars}/>
    </div>
  )
}

export default PullRequestStats
