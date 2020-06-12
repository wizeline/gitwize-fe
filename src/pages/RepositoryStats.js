import React, { useState, useEffect, useContext, useRef } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import { transformMetricsDataApiResponse } from '../utils/apiUtils'
import { getChartOptions } from '../utils/chartUtils'
import { createReversedArray, transformToChartData, filterTableData, convertTableObjectToTableColumn} from '../utils/dataUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'
import PageContext from '../contexts/PageContext'
import DataStats from '../views/DataStats'

const apiClient = new ApiClient()

const tableObject = [
  {text: 'Date', fieldName: 'Date'},
  {text: 'Commits', fieldName: 'Commits', type: 'numeric'}, 
  {text: 'Additions', fieldName: 'Additions', type: 'numeric'}, 
  {text: 'Deletions', fieldName: 'Deletions', type: 'numeric'}, 
  {text: 'Total lines of code', fieldName: 'Total lines of code', type: 'numeric'},
  {text: 'Change percent %', fieldName: 'Change percent %', type: 'numeric'}
]

const tableColumn = convertTableObjectToTableColumn(tableObject)
const chartLines = [{name: 'Commits', color: '#5492FF'}]
const chartBars = [{name: 'Deletions', color: '#EC5D5C'},
                    {name: 'Additions', color: '#DADADA'}]

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
      },
      {
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-2',
        gridLines: {
          display: false
        },
        labels: {
          show: true
        },
        stacked: false,
        ticks: {
          fontColor: "#5392FF",
          fontSize: 10
        }
      }
    ]
  }
};

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
      const tableData = filterTableData(createReversedArray(dataTransformed), tableObject);
      const chartData = transformToChartData(chartLines, chartBars, dataTransformed, 'Date')
      setRepoData(tableData);
      setChartData(chartData);
    })
  }, [authState.accessToken, id, mainLayout, dateRange])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>Repository Request Stats</PageTitle>
      <DataStats tableData={repoData} chartData={chartData} tableColumn={tableColumn} chartOptions={getChartOptions(chartOptions)}/>
    </div>
  )
}

export default RepositoryStats
