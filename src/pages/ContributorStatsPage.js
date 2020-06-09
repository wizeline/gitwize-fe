import React, { useState, useEffect, useContext, useRef} from 'react'
import { useOktaAuth } from '@okta/okta-react'
import * as cloneDeep from 'lodash/cloneDeep';

import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import Grid from '@material-ui/core/Grid'
import DropdownList from '../components/DropdownList'
import DataStats from '../views/DataStats';
import { transformToChartData } from '../utils/dataUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'

const apiClient = new ApiClient()
const tableObject = [
  {text: 'Contributor name', fieldName: 'name'},
  {text: 'Commits', fieldName: 'commits', type: 'numeric'}, 
  {text: 'Additions', fieldName: 'additions', type: 'numeric'}, 
  {text: 'Deletions', fieldName: 'deletions', type: 'numeric'}, 
  {text: 'Net change', fieldName: 'netChanges', type: 'numeric'}, 
  {text: 'New code percent %', fieldName: 'newCodePercents', type: 'numeric'}, 
  {text: 'Change percent %', fieldName: 'changePercent', type: 'numeric'}, 
  {text: 'Active days', fieldName: 'activeDays', type: 'numeric'}, 
  {text: 'Files change', fieldName: 'filesChange', type: 'numeric'}]

const tableColumns = tableObject.flatMap(item => ({
  title: item.text,
  field: item.text,
  type: (item.type) ? item.type : 'string'
}))

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
  return data.map((item) => {
    return Object.assign(...tempTableObject.map((object) => ({[object.text]: item[object.fieldName]})))
  })
}
const chartLines = [{name: 'Commits', color: '#5392FF', dash: [12,3,3]},
                    {name: 'Files change', color: '#62C8BA'}]
const chartBars = [{name: 'Additions', color: '#EC5D5C'}, {name: 'Deletions', color: '#DADADA'}]

function ContributorStatsPage(props) {
  
  const {id} = props.match.params;
  const [repoData, setRepoData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [userFilterList, setUserFilterList] = useState([]);
  const { authState } = useOktaAuth();
  const mainLayout = useRef(useContext(MainLayoutContex))

  const handleChangeUser = (userName) =>  {
    console.log(userName);
  }
  
  const userFilter = (<Grid item xs={2} key={'user-filter'}>
                          <DropdownList label="User" data={userFilterList} value={userFilterList[0] ? userFilterList[0] : ''} placeholder="Select a User" onChange={(userName) => handleChangeUser(userName)}/>
                      </Grid>);

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    mainLayout.current.handleChangeRepositoryId(id)
    apiClient.contributor.getContributorStats(id).then((data) => {
      const tableData = tranformData(data.metric, true);
      let userList = ['Average'];
      userList = userList.concat(data.metric.flatMap(item => item.name))
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
      <DataStats tableData={repoData} chartData={chartData} tableColumn={tableColumns} customFilters={userFilter} 
      isDisplayMaterialTable={true}/>
    </div>
  )
}

export default ContributorStatsPage
