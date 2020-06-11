import React, { useState, useEffect, useContext, useRef } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import { transformMetricsDataApiResponse } from '../utils/apiUtils'
import { transformToChartData, filterTableData} from '../utils/dataUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'
import DataStats from '../views/DataStats'
import PageContext from '../contexts/PageContext'

const apiClient = new ApiClient()
const tableColumn = ['Date', 'Merged', 'Rejected', 'Created']
const chartBars = [{name: 'Created', color: '#EC5D5C'}, {name: 'Merged', color: '#5492FF'}, {name: 'Rejected', color: '#62C8BA'}, ]
const chartOptions = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  elements: {
    line: {
      fill: false
    }
  },
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
          fontSize: 10
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
          fontSize: 10
        }
      }
    ]
  },
  legend: {
    position: 'bottom'
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
      const tranformedData = filterTableData(transformMetricsDataApiResponse(data.metric, dateRange), tableColumn);
      const chartData = transformToChartData([], chartBars, tranformedData, 'Date')
      setChartData(chartData);
      setRepoData(tranformedData)
    })
  }, [authState.accessToken, id, mainLayout, dateRange])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>Pull Request Stats</PageTitle>
      <DataStats tableData={repoData} chartData={chartData}
                    tableColumn={tableColumn} chartOptions={chartOptions}/>
    </div>
  )
}

export default PullRequestStats
