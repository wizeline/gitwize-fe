import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.1)',
    borderRadius: 4
  },
  table: {
    minWidth: 650
  },
  headTextColor: {
    color: '#334D6E',
    opacity: 0.5,
    fontWeight: 500
  },
  bodyTextColor: {
    color: '#707683'
  }
}))

export default function TableData({data}) {
  const classes = useStyles()

  const headRow = () => {
    if(data.length !== 0) {
      return (
        <TableRow>
          {
            Object.keys(data[0]).map((value) => (
              <TableCell key={value} className={classes.headTextColor}>{value}</TableCell>
            ))
          }
        </TableRow>
      )
    }
    return
  }

  const bodyContent = () => {
    return (
      <React.Fragment>
      {
        data.map((row, index) => (
          <TableRow key={index}>
            {
              Object.entries(row).map(([key, value]) => (
                <TableCell component="th" scope="row" className={classes.bodyTextColor}>{value}</TableCell>
              ))
            }
          </TableRow>
        ))
      }
      </React.Fragment>
    )
  }

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          {headRow()}
        </TableHead>
        <TableBody>
          {bodyContent()}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

TableData.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
}

