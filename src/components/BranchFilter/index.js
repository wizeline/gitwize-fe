import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import DropdownList from '../DropdownList'
import { fetchBranchesFromServer } from '../../services/dataFetchingService'
import DatePicker from '../DatePicker'

const showDate = ['Last 90 Days', 'Last 60 Days', 'Last 30 Days', 'Last 7 Days']

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(5)
  }
}))

export default function BranchPicker() {
  const [branches, setBranches] = useState([])
  const today = new Date()
  const styles = useStyles()

  useEffect(() => {
    fetchBranchesFromServer().then(data => setBranches(data))
  }, [])

  return (
    <Grid container className={styles.root}>
      <Grid item xs={6}>
        <DropdownList label="Branch" data={branches} placeholder={"Select a branch"}/>
      </Grid>
      <Grid item xs={2}>
        <DropdownList label="Show" data={showDate} placeholder={"Select a period"}/>
      </Grid>
      <Grid item xs={2}>
        <DatePicker label="From" />
      </Grid>
      <Grid item xs={2}>
        <DatePicker label="To" maxDate={today}/>
      </Grid>
    </Grid>
  )
}
