import React, { useState, useEffect, useContext, useRef} from 'react'
import { useOktaAuth } from '@okta/okta-react'
import * as cloneDeep from 'lodash/cloneDeep';

import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import Grid from '@material-ui/core/Grid'
import DropdownList from '../components/DropdownList'
import DataStats from '../views/DataStats';
import { transformToChartData, filterTableData, convertTableObjectToTableColumn } from '../utils/dataUtils'
import {getChartOptions} from '../utils/chartUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'
import PageContext from '../contexts/PageContext';

const apiClient = new ApiClient()
const information = `This section will display the following data for the selected team member from the dropdown, for each day of the selected date range. 
\n\n - Number of commits 
\n\n - Number of additions in lines of code 
\n\n - Number of deletions in lines of code 
\n\n - Number of files changed or worked upon 
\n\n - Change percentage in lines of code with respect to other team members: 
This will indicate the amount of changes made by the user compared to other team members`

const tranformData = (data, isTableData, tableObject) => {
  let tempTableObject = [];
  if(isTableData) {
    tempTableObject = cloneDeep(tableObject);
  } else {
    const chartObject = cloneDeep(tableObject);
    chartObject.shift();
    tempTableObject = cloneDeep(chartObject);
    tempTableObject.push({text: 'Date', fieldName: 'date'});
    tempTableObject.push({text: 'Change percentage', fieldName: 'changePercent'});
  }
  return filterTableData(data, tempTableObject);
}
const chartLinesConfig = [{name: 'Commits', color: '#5392FF', yAxisId: 'line-1'},
                    {name: 'Files change', color: '#F5A961', yAxisId: 'line-2'},
                    {name: 'Change percentage', color: '#D3A2FF', yAxisId: 'line-3'}]
const chartBars = [{name: 'Additions', color: '#62C8BA'}, {name: 'Deletions', color: '#EC5D5C'}]

const chartOptionsInit = {
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
  },
};

function ContributorStatsPage(props) {
  
  const {id} = props.match.params;
  const [repoData, setRepoData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [maxNetChange, setMaxNetChange] = useState([]);
  const [chartLines, setChartLines] = useState(chartLinesConfig)
  const [chartOptions, setChartOptions] = useState()
  const [data, setData] = useState([]);
  const [userFilterList, setUserFilterList] = useState([]);
  const { authState } = useOktaAuth();
  const mainLayout = useRef(useContext(MainLayoutContex))
  const [{ dateRange }] = useContext(PageContext)

  const tableObject = [
    {text: 'Contributor name', fieldName: 'name', searchable: true},
    {text: 'Commits', fieldName: 'commits', type: 'numeric'}, 
    {text: 'Additions', fieldName: 'additions', type: 'numeric'}, 
    {text: 'Deletions', fieldName: 'deletions', type: 'numeric'}, 
    {text: 'Net change', fieldName: 'netChanges', type: 'numeric',
      render: rowData => {
        const value = rowData['Net change']
        if(value < 0) {
          return (<div style={{background: '#DC6660', borderRadius: '4px', padding: '0 50%', color: 'white'}}>{rowData['Net change']}</div>)
        } else if(value === maxNetChange) {
          return (<div style={{background: '#7DC5BA', borderRadius: '4px', padding: '0 50%', color: 'white'}}>{rowData['Net change']}</div>)
        } else {
          return (<div>{rowData['Net change']}</div>)
        }
      }
    }, 
    {text: 'Active days', fieldName: 'activeDays', type: 'numeric'}, 
    {text: 'Files change', fieldName: 'filesChange', type: 'numeric'}
  ]
  const tableColumns = convertTableObjectToTableColumn(tableObject)

  const handleChangeUser = (userName) =>  {
    const chosenUser = userFilterList.find(item => item.author_name === userName)
    let chartData;
    let newChartLines = cloneDeep(chartLinesConfig);
    if(chosenUser && chosenUser.author_email !== 'Average') {
      chartData = data.chart[chosenUser.author_email]
      newChartLines.splice(newChartLines.length -1, 1)
    } else {
      chartData = data.chart['average'];
    }
    setChartOptions(getChartOptions(chartOptionsInit, newChartLines))
    setChartLines(newChartLines)
    setChartData(transformToChartData(newChartLines, chartBars, tranformData(chartData, false, tableObject), 'Date'));
  }
  
  const userFilter = (<Grid item xs={2} key={'user-filter'}>
                          <DropdownList label="User" data={userFilterList.flatMap(item => item.author_name)} value={'Average'} placeholder="Select a User" onChange={(userName) => handleChangeUser(userName)}/>
                      </Grid>);

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    mainLayout.current.handleChangeRepositoryId(id)
    setChartOptions(getChartOptions(chartOptionsInit, chartLinesConfig))
    apiClient.contributor.getContributorStats(id, dateRange).then((respone) => {
      const tableData = respone.table;
      const chartData = respone.chart['average']
      const maxNetChangeValue = tableData.flatMap(item => item.netChanges).reduce((a,b) => Math.max(a,b))
      setMaxNetChange(maxNetChangeValue)
      setUserFilterList(respone.Contributors);
      setRepoData(tranformData(tableData, true, tableObject));
      setChartData(transformToChartData(chartLinesConfig, chartBars, tranformData(chartData, false, tableObject), 'Date'));
      setData(respone)
    })
    // eslint-disable-next-line
  }, [authState.accessToken, id, mainLayout, dateRange])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Contributor Stats</PageTitle>
      <DataStats tableData={repoData} chartData={chartData} tableColumn={tableColumns} customFilters={[userFilter]} 
      isDisplaySearch={true} chartBars={chartBars} chartLines={chartLines} chartOptions={chartOptions}/>
    </div>
  )
}

export default ContributorStatsPage
