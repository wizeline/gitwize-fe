import React, { useState, useEffect, useContext, useRef } from 'react'
import { useOktaAuth } from '@okta/okta-react'

import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import { transformMetricsDataApiResponse } from '../utils/apiUtils'
import {getChartOptions} from '../utils/chartUtils'
import { createReversedArray, transformToChartData, filterTableData, convertTableObjectToTableColumn} from '../utils/dataUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'
import PageContext from '../contexts/PageContext'
import DataStats from '../views/DataStats'
import {cloneDeep} from 'lodash'

const apiClient = new ApiClient()
const information = "This section will display the number of commits, and additions/deletions in lines of code for the selected branch and date range";

const tableObject = [
  {text: 'Date', fieldName: 'Date'},
  {text: 'Commits', fieldName: 'Commits', type: 'numeric'}, 
  {text: 'Additions', fieldName: 'Additions', type: 'numeric'}, 
  {text: 'Deletions', fieldName: 'Deletions', type: 'numeric'}
]

const tableColumn = convertTableObjectToTableColumn(tableObject)
const chartLines = [{name: 'Commits', color: '#5492FF', yAxisId: 'line-1'}]
const chartBars = [{name: 'Deletions', color: '#EC5D5C'},
                    {name: 'Additions', color: '#62C8BA'}]


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
          suggestedMax: 10
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
      const tableData = filterTableData(cloneDeep(createReversedArray(dataTransformed)), tableObject);
      const chartData = transformToChartData(chartLines, chartBars, dataTransformed, 'Date')
      setRepoData(tableData);
      setChartData(chartData);
    })
  }, [authState.accessToken, id, dateRange])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Repository Stats</PageTitle>
      <DataStats chartBars={chartBars} chartLines={chartLines} tableData={repoData} chartData={chartData} tableColumn={tableColumn} chartOptions={getChartOptions(chartOptions, chartLines)}/>
    </div>
  )
}

export default RepositoryStats
