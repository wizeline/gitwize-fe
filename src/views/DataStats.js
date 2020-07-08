import React, {useState} from 'react'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';
import TableData from '../components/TableData'
import Chart from '../components/Chart'
import useToggle from '../hooks/useToggle'
import BranchFilter from '../components/BranchFilter'

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

function DataStats(props) {
    const {tableData, chartData, tableColumn, isDisplaySearch, customFilters, chartOptions, chartBars = [], chartLines = [], tableCustomComponent} = props
    const [isDisplayChart, toggleChartTable] = useToggle(true);
    const classes = useStyles();
    const [headerTxt, setHeaderTxt] = useState(showDate[0])

    const handleToggleView = () => {
        toggleChartTable();
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
          {isDisplayChart && <Chart data={chartData} chartOptions={chartOptions} chartBars={chartBars} chartLines={chartLines}/>}
        </>
      )
}

export default DataStats;