import React, { useState, useEffect, useContext, useRef } from 'react'

import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import { transformMetricsDataApiResponse } from '../utils/apiUtils'
import {
  createReversedArray,
  transformToChartData,
  filterTableData,
  convertTableObjectToTableColumn,
} from '../utils/dataUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'
import PageContext from '../contexts/PageContext'
import DataStats from '../views/DataStats'
import { cloneDeep } from 'lodash'
import { useAuth } from '../hooks/authService'

const apiClient = new ApiClient()

const information =
  'This section will display the number of commits, and additions/deletions in lines of code for the selected branch and date range'

const tableObject = [
  { text: 'Date', fieldName: 'Date' },
  { text: 'Commits', fieldName: 'Commits' },
  { text: 'Additions', fieldName: 'Additions' },
  { text: 'Deletions', fieldName: 'Deletions' },
]

const tableColumn = convertTableObjectToTableColumn(tableObject)
const chartLines = [{ name: 'Commits', color: '#5492FF', yAxisId: 'line-1' }]
const chartBars = [
  { name: 'Deletions', color: '#EC5D5C' },
  { name: 'Additions', color: '#62C8BA' },
]

const chartOptions = {
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false,
        },
        stacked: true,
        ticks: {
          fontColor: '#C4C4C4',
          fontSize: 10,
          autoSkip: true,
          autoSkipPadding: 30,
        },
      },
    ],
    yAxes: [
      {
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        gridLines: {
          display: true,
        },
        labels: {
          show: true,
        },
        stacked: true,
        ticks: {
          fontColor: '#C4C4C4',
          fontSize: 10,
          beginAtZero: true,
          precision: 0,
          suggestedMax: 10,
        },
      },
    ],
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
      },
    },
  },
}

function RepositoryStats(props) {
  const {pageTitle} = props
  const [repoData, setRepoData] = useState([])
  const [chartData, setChartData] = useState([])
  const { authService } = useAuth()
  const [{ dateRange }] = useContext(PageContext)
  const mainLayout = useRef(useContext(MainLayoutContex))
  const { id } = props.match.params
  apiClient.setAuthService(authService)

  useEffect(() => {
    apiClient.stats.getRepoStats(id, dateRange).then((data) => {
      mainLayout.current.handleChangeRepositoryId(id)
      const dataTransformed = transformMetricsDataApiResponse(data.metric, dateRange)
      const tableData = filterTableData(cloneDeep(createReversedArray(dataTransformed)), tableObject)
      const chartRawData = transformToChartData(chartLines, chartBars, dataTransformed, 'Date')
      setRepoData(tableData)
      setChartData(chartRawData)
    })
  }, [id, dateRange])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>{pageTitle}</PageTitle>
      <DataStats
        chartBars={chartBars}
        chartLines={chartLines}
        tableData={repoData}
        chartData={chartData}
        tableColumn={tableColumn}
        chartOptions={chartOptions}
      />
    </div>
  )
}

export default RepositoryStats
