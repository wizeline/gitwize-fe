import React, { useState, useEffect, useContext, useRef } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import { transformMetricsDataApiResponse } from '../utils/apiUtils'
import {getChartOptions} from '../utils/chartUtils'
import { transformToChartData, filterTableData, convertTableObjectToTableColumn} from '../utils/dataUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'
import DataStats from '../views/DataStats'
import PageContext from '../contexts/PageContext'
import {cloneDeep} from 'lodash'

const apiClient = new ApiClient()
const information = 'This section will display the number of open/merged/rejected PRs for the selected branch and date range'
const tableObject = [
  {text: 'Date', fieldName: 'Date'},
  {text: 'Merged', fieldName: 'Merged', type: 'numeric'}, 
  {text: 'Rejected', fieldName: 'Rejected', type: 'numeric'}, 
  {text: 'Created', fieldName: 'Created', type: 'numeric'},
]
const tableColumn = convertTableObjectToTableColumn(tableObject)
const chartBars = [{name: 'Created', color: '#EC5D5C'}, {name: 'Merged', color: '#5492FF'}, {name: 'Rejected', color: '#62C8BA'}, ]
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
  }
};

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
      const transformedData = transformMetricsDataApiResponse(data.metric, dateRange);
      const repoData = filterTableData(cloneDeep(transformedData), tableObject);
      const chartData = transformToChartData([], chartBars, transformedData, 'Date')
      setChartData(chartData);
      setRepoData(repoData)
    })
  }, [authState.accessToken, id, mainLayout, dateRange])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Pull Request Stats</PageTitle>
      <DataStats tableData={repoData} chartData={chartData} chartBars={chartBars}
                    tableColumn={tableColumn} chartOptions={getChartOptions(chartOptions)}/>
    </div>
  )
}

export default PullRequestStats
