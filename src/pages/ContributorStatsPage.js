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

const apiClient = new ApiClient()
const tableObject = [
  {text: 'Contributor name', fieldName: 'name', searchable: true},
  {text: 'Commits', fieldName: 'commits', type: 'numeric'}, 
  {text: 'Additions', fieldName: 'additions', type: 'numeric'}, 
  {text: 'Deletions', fieldName: 'deletions', type: 'numeric'}, 
  {text: 'Net change', fieldName: 'netChanges', type: 'numeric'}, 
  {text: 'Code percent %', fieldName: 'newCodePercents', type: 'numeric'}, 
  {text: 'Change percent %', fieldName: 'changePercent', type: 'numeric'}, 
  {text: 'Active days', fieldName: 'activeDays', type: 'numeric'}, 
  {text: 'Files change', fieldName: 'filesChange', type: 'numeric'}]

const tableColumns = convertTableObjectToTableColumn(tableObject)

const tranformData = (data, isTableData) => {
  let tempTableObject = [];
  if(isTableData) {
    tempTableObject = cloneDeep(tableObject);
  } else {
    const chartObject = cloneDeep(tableObject);
    chartObject.shift();
    tempTableObject = cloneDeep(chartObject);
    tempTableObject.push({text: 'Date', fieldName: 'date'});
  }
  return filterTableData(data, tempTableObject);
}
const chartLines = [{name: 'Commits', color: '#5392FF', yAxisId: 'line-1'},
                    {name: 'Files change', color: '#62C8BA', yAxisId: 'line-2'}]
const chartBars = [{name: 'Additions', color: '#EC5D5C'}, {name: 'Deletions', color: '#DADADA'}]

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
          beginAtZero: true
        }
      }
    ]
  }
};

function ContributorStatsPage(props) {
  
  const {id} = props.match.params;
  const [repoData, setRepoData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [userFilterList, setUserFilterList] = useState(["Average"]);
  const { authState } = useOktaAuth();
  const mainLayout = useRef(useContext(MainLayoutContex))

  const handleChangeUser = (userName) =>  {
    console.log(userName);
  }
  
  const userFilter = (<Grid item xs={2} key={'user-filter'}>
                          <DropdownList label="User" data={userFilterList} value={'Average'} placeholder="Select a User" onChange={(userName) => handleChangeUser(userName)}/>
                      </Grid>);

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    mainLayout.current.handleChangeRepositoryId(id)
    apiClient.contributor.getContributorStats(id).then((data) => {
      const tableData = tranformData(data.metric, true);
      const userList = data.metric.flatMap(item => item.name)
      setUserFilterList(userList);
      setRepoData(tableData);
    })
    apiClient.contributor.getContributorChartDataStats(id).then((data) => {
      const chartData = transformToChartData(chartLines, chartBars, tranformData(data.metric), 'Date')
      setChartData(chartData);
    })

  }, [authState.accessToken, id, mainLayout])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>Contributor Stats</PageTitle>
      <DataStats tableData={repoData} chartData={chartData} tableColumn={tableColumns} customFilters={[userFilter]} 
      isDisplaySearch={true} chartBars={chartBars} chartLines={chartLines} chartOptions={getChartOptions(chartOptions, chartLines)}/>
    </div>
  )
}

export default ContributorStatsPage
