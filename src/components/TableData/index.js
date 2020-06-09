import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import MaterialTable from "material-table";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    marginBottom: theme.spacing(5),
  },
  table: {
    minWidth: 650,
  },
  headTextColor: {
    color: '#334D6E',
    opacity: 0.5,
    fontWeight: 500,
  },
  bodyTextColor: {
    color: '#707683',
    borderBottom: '1px solid #EBEFF2',
  },
}))

export default function TableData(props) {
  const { tableData, tableColumn, isDisplayMaterialTable = false } = props
  const classes = useStyles()
  let tableObject;
  if(!isDisplayMaterialTable) {

    const headRow = () => {
      if (tableData.length !== 0) {
        return (
          <TableRow>
            {Object.keys(tableData[0]).map((value) => (
              <TableCell key={value} className={classes.headTextColor}>
                {value}
              </TableCell>
            ))}
          </TableRow>
        )
      }
    }

    const bodyContent = () => {
      return (
        <>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              {Object.entries(row).map(([key, value]) => (
                <TableCell key={key} component="th" scope="row" className={classes.bodyTextColor}>
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </>
      )
    }

    tableObject = (<TableContainer component={Paper} className={classes.root}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>{headRow()}</TableHead>
                      <TableBody>{bodyContent()}</TableBody>
                    </Table>
                  </TableContainer>)
  } else {
    tableObject = (<MaterialTable
                    columns={tableColumn}
                    data={tableData}
                    options={{
                      showTitle: false,
                      headerStyle: {
                        color: '#334D6E',
                        opacity: 0.5,
                        fontWeight: 500,
                      },
                      rowStyle: {
                        color: '#707683',
                        borderBottom: '1px solid #EBEFF2',
                      }
                    }}
                  />)
  }
  

  return (
    <div>
          {tableObject}
    </div>

  )
}