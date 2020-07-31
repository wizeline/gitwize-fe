import React, {useState} from 'react'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';
import TableData from '../components/TableData'
import Chart from '../components/Chart'
import useToggle from '../hooks/useToggle'
import BranchFilter from '../components/BranchFilter'
import {getChartOptions} from '../utils/chartUtils'

const showDate = ['Last 7 Days', 'Last 14 Days', 'Last 21 Days', 'Last 30 Days', 'Custom']
const useStyles = makeStyles(() => ({
    root: {
      justifyContent: 'space-between',
      marginBottom: '1vw'
    },
    gridItem: {
      display: 'flex',
      alignItems: 'center'
    },
    button: {
      flexGrow: 0.3,
      fontWeight: 'bold',
      borderRadius: '8px',
      fontSize: '13px'
    },
    textStyle: {
      float: 'left',
      fontSize: '18px',
      fontWeight: '700',
      backgroundColor: 'transparent'
    }
}))

const initValue = (chartInstance, chartLines) => {
  chartInstance.options.scales.yAxes[0].display = true;
  chartInstance.options.scales.yAxes[0].gridLines.display = true;
  if(chartLines && chartLines.length > 0) {
    for(let i = 1; i <= chartLines.length; i++) {
      chartInstance.options.scales.yAxes[i].display = true
      chartInstance.options.scales.yAxes[i].gridLines.display = false
    }
  }
}

export const drawNewOptions = (chartInstance, datasets, chartBars, chartLines = []) => {
  
  initValue(chartInstance, chartLines)
  
  let numberOfLineDisabled = 0;
  let numberOfBarDisabled = 0;
  let i = 0;

  datasets.forEach(item => {
    const meta = chartInstance.getDatasetMeta(i);
    if(item.type === 'line') {
      const yAxisID = item.yAxisID
      if(meta.hidden) {
        numberOfLineDisabled++
        const index = chartInstance.options.scales.yAxes.findIndex(yAxesItem => yAxesItem.id === yAxisID)
        if(index !== -1) {
          chartInstance.options.scales.yAxes[index].display = false
        }
      }
    }

    if(item.type === 'bar') {
      if(meta.hidden) {
        numberOfBarDisabled++
      }
    }
    i++
  })

  //find minimum yAxis index with display === true, mark gridLineDisplay for it
  let yAxisIndexMin = Number.MAX_SAFE_INTEGER;
  for(let i = 1; i < chartInstance.options.scales.yAxes.length; i++) {
    const yAxesValue = chartInstance.options.scales.yAxes[i]
    if(yAxesValue.display && i<yAxisIndexMin) {
      yAxisIndexMin = i
    }
  }

  if(chartBars.length === numberOfBarDisabled  && chartLines.length !== numberOfLineDisabled) {
    chartInstance.options.scales.yAxes[0].display = false;
    chartInstance.options.scales.yAxes[0].gridLines.display = false;
    chartInstance.options.scales.yAxes[yAxisIndexMin].gridLines.display = true
  }

  if(chartBars.length === numberOfBarDisabled  && chartLines.length === numberOfLineDisabled) {
    chartInstance.options.scales.yAxes[0].display = true;
    chartInstance.options.scales.yAxes[0].gridLines.display = true;
    chartInstance.options.scales.yAxes[1].gridLines.display = false
  }
}
function DataStats(props) {
    const {onTableView, tableData, chartData, tableColumn, isDisplaySearch, customFilters, chartOptions, chartBars = [], chartLines = [], tableCustomComponent} = props
    const [isDisplayChart, toggleChartTable] = useToggle(true);
    const classes = useStyles();
    const [headerTxt, setHeaderTxt] = useState(showDate[0])

    const customHandleClickLegend = (chartInstance, datasets) => {
      drawNewOptions(chartInstance, datasets, chartBars, chartLines)
    }

    const handleToggleView = () => {
        toggleChartTable();
        if(onTableView) {
          onTableView(isDisplayChart)
        }
    }

    const handleChangeHeaderTxt = (headerText) => {
      setHeaderTxt(headerText)
    }
    return (
        <>
          <BranchFilter showDate={showDate} onPeriodChange={(headerText) => handleChangeHeaderTxt(headerText)} customFilters={customFilters}/>
          <Grid container className={classes.root}>
            <Grid className={classes.gridItem} item xs={6}>
              <Paper className={classes.textStyle} elevation={0} square={true} variant="elevation">{headerTxt}</Paper>
            </Grid>
            <Grid className={classes.gridItem} style={{justifyContent: 'flex-end'}} item xs={6}>
              <Button className={classes.button} variant="outlined" onClick={handleToggleView}>{isDisplayChart ? 'View Table' : 'View Chart'}</Button>
            </Grid>
          </Grid>
          {!isDisplayChart && <TableData tableData={tableData} tableColumn={tableColumn} isDisplaySearch={isDisplaySearch} customComponent={tableCustomComponent}/>}
          {isDisplayChart && <Chart customHandleClickLegend={customHandleClickLegend} data={chartData} chartOptions={getChartOptions(chartOptions, chartLines)}/>}
        </>
      )
}

export default DataStats;