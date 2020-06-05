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
  const {showDate, onPeriodChange} = props
  const [branches, setBranches] = useState([])
  const today = new Date()
  const styles = useStyles()

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
      <Grid item xs={6}>
        <DropdownList label="Branch" data={branches} onChange={(value) => handleChangeBranchValue(value)}/>
      </Grid>
      <Grid item xs={2}>
        <DropdownList label="Show" data={showDate} onChange={(value) => handleChangePeriodValue(value)}/>
      </Grid>
      <Grid item xs={2}>
        <DatePicker label="From" />
      </Grid>
      <Grid item xs={2}>
        <DatePicker label="To" maxDate={today} />
      </Grid>
    </Grid>
  )
}
