import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import DropdownList from '../DropdownList'
import { fetchBranchesFromServer } from '../../services/dataFetchingService'
import DatePicker from '../DatePicker'

const showDate = ['Last 90 Days', 'Last 60 Days', 'Last 30 Days', 'Last 7 Days']

export default function BranchPicker() {
  const [branches, setBranches] = useState([])
  const today = new Date()

  useEffect(() => {
    fetchBranchesFromServer().then(data => setBranches(data))
  }, [])

  return (
    <Grid container>
      <Grid item xs={6}>
        <DropdownList label="Branch" data={branches} />
      </Grid>
      <Grid item xs={2}>
        <DropdownList label="Show" data={showDate} />
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
