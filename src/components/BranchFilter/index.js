import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import DropdownList from '../DropdownList'
import { fetchBranchesFromServer } from '../../services/dataFetchingService'
import DatePicker from '../DatePicker'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(5),
  },
}))

export default function BranchPicker(props) {
  const {showDate, onPeriodChange, customFilters = []} = props
  const [branches, setBranches] = useState([])
  const today = new Date()
  const styles = useStyles()
  const defaultItemSize = 2;
  let branchFilterSize =  12 - (customFilters.length*2 + defaultItemSize*3);
  branchFilterSize = branchFilterSize < 2 ? 2 : branchFilterSize;

  useEffect(() => {
    fetchBranchesFromServer().then((data) => setBranches(data))
  }, [])

  const handleChangePeriodValue = (value) => {
    onPeriodChange(value);
  }
  const handleChangeBranchValue = (value) => {
    //DO NOTHING
    return;
  }

  return (
    <Grid container className={styles.root}>
      <Grid item xs={branchFilterSize}>
        <DropdownList label="Branch" data={branches} onChange={(value) => handleChangeBranchValue(value)}/>
      </Grid>
      <Grid item xs={defaultItemSize}>
        <DropdownList label="Period" data={showDate} value={''} onChange={(value) => handleChangePeriodValue(value)}/>
      </Grid>
      <Grid item xs={defaultItemSize}>
        <DatePicker label="From" />
      </Grid>
      <Grid item xs={defaultItemSize}>
        <DatePicker label="To" maxDate={today} />
      </Grid>
      {customFilters}
    </Grid>
  )
}
