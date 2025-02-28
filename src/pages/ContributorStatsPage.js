import React, { useState, useEffect, useContext, useRef} from 'react'
import cloneDeep from 'lodash/cloneDeep';

import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import Grid from '@material-ui/core/Grid'
import DropdownList from '../components/DropdownList'
import DataStats from '../views/DataStats';
import { transformToChartData, filterTableData, convertTableObjectToTableColumn, createDumpDataIfMissing } from '../utils/dataUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'
import PageContext from '../contexts/PageContext';
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useAuth } from '../hooks/authService';

const apiClient = new ApiClient()
const NET_CHANGE = 'Net change'
const information = `This section will display the following data for the selected team member from the dropdown, for each day of the selected date range.
\n\n - Number of commits
\n\n - Number of additions in lines of code
\n\n - Number of deletions in lines of code
\n\n - Number of files changed or worked upon
\n\n - Change percentage in lines of code with respect to other team members:
This will indicate the amount of changes made by the user compared to other team members`

const useStyles = makeStyles(() => ({
  negativeTxt: {
    background: '#DC6660',
  },
  maxValueTxt:{
    background: '#7DC5BA',
  },
  tableCell: {
    borderRadius: '4px',
    color: 'white',
    height: 25,
    width: '50%',
    lineHeight: '25px',
    textAlign: 'center'
  }
}))

const tranformData = (data, isTableData, tableObjectInstance) => {
  let tempTableObject = [];
  if(isTableData) {
    tempTableObject = cloneDeep(tableObjectInstance);
  } else {
    const chartObject = cloneDeep(tableObjectInstance);
    chartObject.shift();
    tempTableObject = cloneDeep(chartObject);
    tempTableObject.push({text: 'Date', fieldName: 'date'});
    tempTableObject.push({text: 'Change percentage', fieldName: 'changePercent'});
  }
  return filterTableData(data, tempTableObject);
}
const chartLinesConfig = [{name: 'Commits', color: '#5392FF', yAxisId: 'line-1'},
                    {name: 'Files changed', color: '#F5A961', yAxisId: 'line-2'}]
const chartLinesAverage = {name: 'Change percentage', color: '#D3A2FF', yAxisId: 'line-3'}
const chartBars = [{name: 'Additions', color: '#62C8BA'}, {name: 'Deletions', color: '#EC5D5C'}]

const tableObject = [
  {text: 'Contributor name', fieldName: 'name', searchable: true},
  {text: 'Commits', fieldName: 'commits'},
  {text: 'Additions', fieldName: 'additions'},
  {text: 'Deletions', fieldName: 'deletions'},
  {text: NET_CHANGE, fieldName: 'netChanges'},
  {text: 'Files changed', fieldName: 'filesChange'},
  {text: 'Active days', fieldName: 'activeDays'}
]

const defaultUserDropdown = {author_email: 'Average', author_name: 'Average'}

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
  const {pageTitle} = props
  const {id} = props.match.params;
  const [repoData, setRepoData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [maxNetChange, setMaxNetChange] = useState([]);
  const [chartLines, setChartLines] = useState(chartLinesConfig)
  const [chartOptions, setChartOptions] = useState()
  const [data, setData] = useState([]);
  const [userFilterList, setUserFilterList] = useState([]);
  const { authService } = useAuth();
  const mainLayout = useRef(useContext(MainLayoutContex))
  const [{ dateRange }] = useContext(PageContext)
  const classes = useStyles();
  const [chosenUser, setChosenUser] = useState('Average')
  const [isOnTableView, setOnTableView] = useState(false);

  const cloneTable = cloneDeep(tableObject)
  const customRenderNetChange = (rowData) => {
      const value = rowData[NET_CHANGE]
      if(value < 0) {
        return (<div className={clsx(classes.tableCell, classes.negativeTxt)}>{rowData[NET_CHANGE]}</div>)
      } else if(value === maxNetChange) {
        return (<div className={clsx(classes.tableCell, classes.maxValueTxt)}>{rowData[NET_CHANGE]}</div>)
      } else {
        return (<div>{rowData[NET_CHANGE]}</div>)
      }
  }
  cloneTable.forEach(item => {
    if(item.fieldName === 'netChanges') {
      item.render = customRenderNetChange
    }
  })

  const tableColumns = convertTableObjectToTableColumn(cloneTable)

  const handleChangeUser = (userName) =>  {
    const chosenUser = userFilterList.find(item => item.author_name === userName)
    let chartRawData;
    const newChartLines = cloneDeep(chartLinesConfig);
    if(chosenUser && chosenUser.author_email !== 'Average') {
      chartRawData = data.chart[chosenUser.author_email]
      newChartLines.push(chartLinesAverage)
    } else {
      chartRawData = data.chart['average'];
    }
    const chartDisplayData = createDumpDataIfMissing(chartRawData, dateRange)
    setChartData(transformToChartData(newChartLines, chartBars, tranformData(chartDisplayData, false, tableObject), 'Date'));
    setChartLines(newChartLines)
    setChartOptions(chartOptionsInit)
    setChosenUser(userName)
  }
  apiClient.setAuthService(authService)

  const handleOnTableView = (isOnTableView) => {
    setOnTableView(isOnTableView)
  }

  const initValueChosenUser = (chosenUser && userFilterList.findIndex(item => item.author_name === chosenUser) !== -1) ? chosenUser : 'Average'

  const userFilter = (!isOnTableView && <Grid item xs={2} key={'user-filter'}>
                          <DropdownList label="User" data={userFilterList.flatMap(item => item.author_name)} initValue={initValueChosenUser}
                                        placeholder="Select a User" onChange={(userName) => handleChangeUser(userName)}/>
                      </Grid>);

  useEffect(() => {
    mainLayout.current.handleChangeRepositoryId(id)
    setChartOptions(chartOptionsInit)
    apiClient.contributor.getContributorStats(id, dateRange).then((respone) => {
      const tableData = respone.table;
      const maxNetChangeValue = (tableData && tableData.length > 0) ? tableData.flatMap(item => item.netChanges).reduce((a,b) => Math.max(a,b)) : 0

      const user = respone.contributors.find(item => item.author_name === chosenUser)
      let chartData;
      const newChartLines = cloneDeep(chartLinesConfig);
      if(user && user.author_email !== 'Average') {
        chartData = respone.chart[user.author_email]
        newChartLines.push(chartLinesAverage)
      } else {
        chartData = respone.chart['average'];
      }

      const userFilter = [defaultUserDropdown, ...respone.contributors]

      setMaxNetChange(maxNetChangeValue)
      setUserFilterList(userFilter);
      setRepoData(tranformData(tableData, true, tableObject));
      const chartDisplayData = createDumpDataIfMissing(chartData, dateRange)
      setChartData(transformToChartData(newChartLines, chartBars, tranformData(chartDisplayData, false, tableObject), 'Date'));
      setData(respone)
      setChartOptions(chartOptionsInit)
    })
  }, [id, mainLayout, dateRange, chosenUser])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>{pageTitle}</PageTitle>
      <DataStats onTableView={handleOnTableView} tableData={repoData} chartData={chartData} tableColumn={tableColumns} customFilters={[userFilter]}
      isDisplaySearch={true} chartBars={chartBars} chartLines={chartLines} chartOptions={chartOptions}/>
    </div>
  )
}

export default ContributorStatsPage
