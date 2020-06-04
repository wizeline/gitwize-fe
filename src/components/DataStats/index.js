import React from 'react'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';
import TableData from '../TableData'
import Chart from '../Chart'
import useToggle from '../../hooks/useToggle'

const useStyles = makeStyles((theme) => ({
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
    },
    textStyle: {
      float: 'left',
      fontSize: '20px',
      fontWeight: 'bold'
    }
}))

function DataStats(props) {
    const {tableData, chartData, xAxis, tableColumn, chartLines, chartBars} = props
    const [isDisplayChart, toggleChartTable] = useToggle(true);
    const classes = useStyles();

    const handleToggleView = () => {
        toggleChartTable();
    }
    return (
        <>
          <Grid container className={classes.root}>
            <Grid className={classes.gridItem} item xs={6}>
              <Paper className={classes.textStyle} elevation={0} square={true} variant="elevation">Last 14 Days</Paper>
            </Grid>
            <Grid className={classes.gridItem} style={{justifyContent: 'flex-end'}} item xs={6}>
              <Button className={classes.button} variant="outlined" onClick={handleToggleView}>{isDisplayChart ? 'View Table' : 'View Chart'}</Button>
            </Grid>
          </Grid>
          {!isDisplayChart && <TableData tableData={tableData} tabelColumn={tableColumn} />}
          {isDisplayChart && <Chart data={chartData} xAxis={xAxis} lines={chartLines} bars={chartBars} />}
        </>
      )
}

export default DataStats;