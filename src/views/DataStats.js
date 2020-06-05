import React, {useState} from 'react'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';
import TableData from '../components/TableData'
import Chart from '../components/Chart'
import useToggle from '../hooks/useToggle'
import BranchFilter from '../components/BranchFilter'

const showDate = ['Last 90 Days', 'Last 60 Days', 'Last 30 Days', 'Last 7 Days']
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
      fontFamily: 'Poppins',
      fontSize: '13px'
    },
    textStyle: {
      float: 'left',
      fontSize: '20px',
      fontWeight: 'bold'
    }
}))

function DataStats(props) {
    const {tableData, chartData, xAxis, tableColumn, chartLines, chartBars, isDisplayMaterialTable, customFilters} = props
    const [isDisplayChart, toggleChartTable] = useToggle(true);
    const classes = useStyles();
    const [headerTxt, setHeaderTxt] = useState(showDate[0])

    const handleToggleView = () => {
        toggleChartTable();
    }

    const handleChangeHeaderTxt = (headerTxt) => {
      setHeaderTxt(headerTxt)
    }
    return (
        <>
          <BranchFilter showDate={showDate} onPeriodChange={(headerTxt) => handleChangeHeaderTxt(headerTxt)} customFilters={customFilters}/>
          <Grid container className={classes.root}>
            <Grid className={classes.gridItem} item xs={6}>
              <Paper className={classes.textStyle} elevation={0} square={true} variant="elevation">{headerTxt}</Paper>
            </Grid>
            <Grid className={classes.gridItem} style={{justifyContent: 'flex-end'}} item xs={6}>
              <Button className={classes.button} variant="outlined" onClick={handleToggleView}>{isDisplayChart ? 'View Table' : 'View Chart'}</Button>
            </Grid>
          </Grid>
          {!isDisplayChart && <TableData tableData={tableData} tableColumn={tableColumn} isDisplayMaterialTable={isDisplayMaterialTable}/>}
          {isDisplayChart && <Chart data={chartData} xAxis={xAxis} lines={chartLines} bars={chartBars} />}
        </>
      )
}

export default DataStats;