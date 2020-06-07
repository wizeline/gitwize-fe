import React, { useEffect, useState, useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import DropdownList from '../DropdownList'
import { transformPeriodToDateRange } from '../../utils/dataUtils'
import DatePicker from '../DatePicker'
import PageContext from '../../contexts/PageContext'
import { convertDateToSecond } from '../../utils/apiUtils'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(5),
  },
}))

const today = new Date()
const last7Days = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000))

export default function BranchPicker(props) {
  const {showDate, onPeriodChange, customFilters = []} = props
  const [branches, setBranches] = useState(['maser'])
  const [openDatePicker , setOpenDatePicker] = useState(false)
  const [date, setDate] = useState({
    from: last7Days,
    to: today
  })
  const [{ dateRange }, dispatch] = useContext(PageContext)
  const styles = useStyles()
  const defaultItemSize = 2;
  const datePickerSize = 3;
  let branchFilterSize =  12 - (customFilters.length*2 + defaultItemSize + datePickerSize);
  branchFilterSize = branchFilterSize < 2 ? 2 : branchFilterSize;


  useEffect(() => {
    dispatch({
      type: 'changeDate',
      newDate: { 
        date_from: convertDateToSecond(date.from),
        date_to: convertDateToSecond(date.to)
      }
    })

  }, [date])

  const handleChangePeriodValue = (value) => {
    if(value === 'Custom') {
      setOpenDatePicker(true)
    } else {
      setOpenDatePicker(false)
      const periodDateRange = transformPeriodToDateRange(value)
      setDate({
        from: periodDateRange.period_date_from,
        to: periodDateRange.period_date_to
      })
      onPeriodChange(value);
    }
  }

  const handleChangeBranchValue = (value) => {
    /** 
     * TODO: Users can view stats of a specific branch
     *  */ 
  }

  const handleDatePickerValue = (value) => {
    if(value.from !== undefined && value.to !== undefined) {
      setDate(value)
      value = `${(value.from).toLocaleDateString()} - ${(value.to).toLocaleDateString()}`
      onPeriodChange(value)
    }
  }

  return (
    <Grid container className={styles.root}>
      <Grid item xs={branchFilterSize}>
        <DropdownList label="Branch" data={branches} onChange={(value) => handleChangeBranchValue(value)}/>
      </Grid>
      <Grid item xs={defaultItemSize}>
        <DropdownList label="Period" data={showDate} value={''} onChange={(value) => handleChangePeriodValue(value)}/>
      </Grid>
      <Grid item xs={datePickerSize} style={{display: `${openDatePicker ? "block" : "none"}` }}>
        <DatePicker label="Date Range" onChange={handleDatePickerValue} />
      </Grid>
      {customFilters}
    </Grid>
  )
}
