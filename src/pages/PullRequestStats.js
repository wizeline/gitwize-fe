import React, { useState, useEffect, useContext, useRef } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import { transformMetricsDataApiResponse } from '../utils/apiUtils'
import { transformToChartData, filterTableData, convertTableObjectToTableColumn} from '../utils/dataUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'
import DataStats from '../views/DataStats'
import PageContext from '../contexts/PageContext'
import {cloneDeep} from 'lodash'

const apiClient = new ApiClient()
const information = 'This section will display the following data for each day in the selected date range \n\n\n - Number of Open PRs at the end of the day, based on the status of PRs \n\n\n - Number of Created/merged/rejected PRs at the end of the day, based on the PR activity'
const tableObject = [
  {text: 'Date', fieldName: 'Date'},
  {text: 'Merged', fieldName: 'Merged'}, 
  {text: 'Rejected', fieldName: 'Rejected'}, 
  {text: 'Created', fieldName: 'Created'},
  {text: 'Open', fieldName: 'Open'},
]
const tableColumn = convertTableObjectToTableColumn(tableObject)
const chartBars = [
  {name: 'Created', color: '#62C8BA', stackId: 'stack-0', categoryPercentage: 0.5, barPercentage: 0.7}, 
  {name: 'Merged', color: '#5492FF', stackId: 'stack-0', categoryPercentage: 0.5, barPercentage: 0.7}, 
  {name: 'Rejected', color: '#EC5D5C', stackId: 'stack-0', categoryPercentage: 0.5, barPercentage: 0.7}, 
  {name: 'Open', color: '#D3A2FF', stackId: 'stack-1', categoryPercentage: 0.5, barPercentage: 0.7}, 
]
const chartOptions = {
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false
        },
        stacked: true,
        ticks: {
          fontColor: "#C4C4C4",
          fontSize: 10,
          autoSkip: true,
          autoSkipPadding: 30
        }
      }
    ],
    yAxes: [
      {
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        gridLines: {
          display: true
        },
        labels: {
          show: true
        },
        stacked: true,
        ticks: {
          fontColor: "#C4C4C4",
          fontSize: 10,
          beginAtZero: true,
          precision: 0,
          suggestedMax: 5
        }
      }
    ]
  },
  tooltips: {
    mode: 'label',
    bodySpacing: 10,
    titleMarginBottom: 10,
    titleFontSize: 14,
    titleFontStyle: 'bold',
    footerAlign: 'right',
    callbacks: {
      label: (tooltipItem, data) => {
        const label = data.datasets[tooltipItem.datasetIndex].label || ''
        const value = tooltipItem.value
        return `   ${label}: ${value}`
      }
    }
  }
};

function PullRequestStats(props) {
  const [repoData, setRepoData] = useState([])
  const [chartData, setChartData] = useState([])
  const { authState, authService } = useOktaAuth()
  const [{ dateRange }] = useContext(PageContext)
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params

  useEffect(() => {
    apiClient.setTokenManager(authService.getTokenManager())
    apiClient.setAccessToken(authState.accessToken)
    apiClient.stats.getRepoStats(id, dateRange).then((data) => {
      mainLayout.current.handleChangeRepositoryId(id)
      const transformedData = transformMetricsDataApiResponse(data.metric, dateRange);
      const repoRawData = filterTableData(cloneDeep(transformedData), tableObject);
      const chartRawData = transformToChartData([], chartBars, transformedData, 'Date')
      setChartData(chartRawData);
      setRepoData(repoRawData)
    })
  }, [authState.accessToken, id, mainLayout, dateRange])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Pull Request Stats</PageTitle>
      <DataStats tableData={repoData} chartData={chartData} chartBars={chartBars}
                    tableColumn={tableColumn} chartOptions={chartOptions}/>
    </div>
  )
}

export default PullRequestStats
