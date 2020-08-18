import React, { useEffect, useState, useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import DropdownList from '../DropdownList'
import { transformPeriodToDateRange } from '../../utils/dataUtils'
import DatePicker from '../DatePicker'
import PageContext from '../../contexts/PageContext'
import MainLayoutContex from '../../contexts/MainLayoutContext'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(5),
  },
}))

export default function BranchPicker(props) {
  const {showDate, onPeriodChange, customFilters = []} = props
  const [openDatePicker , setOpenDatePicker] = useState(false)
  const [{dateRange}, dispatch] = useContext(PageContext)
  const [date, setDate] = useState({
    from: dateRange.date_from,
    to: dateRange.date_to
  })

  const mainLayoutContext = useContext(MainLayoutContex)
  const styles = useStyles()
  const defaultItemSize = 2;
  const datePickerSize = 4;
  let branchFilterSize =  12 - (customFilters.length*2 + defaultItemSize + datePickerSize);
  branchFilterSize = branchFilterSize < 2 ? 2 : branchFilterSize;
  const listBranch = ['master']
  if(mainLayoutContext.repoList) {
    // const currentRepo = mainLayoutContext.repoList.find(item =>  {
    //   if(String(item.id) === mainLayoutContext.repositoryId) {
    //     return item;
    //   }
    //   return null
    // })
    // if(currentRepo) {
    //   currentRepo.branches.forEach(item => {
    //     if(listBranch.indexOf(item) === -1) {
    //       listBranch.push(item)
    //     }
    //   })
    // }
  }

  useEffect(() => {
    dispatch({
      type: 'changeDate',
      newDate: {
        date_from: date.from,
        date_to: date.to
      }
    })
  }, [date, dispatch])

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
        <DropdownList label="Branch" data={listBranch} onChange={handleChangeBranchValue} isDisabled={true}/>
      </Grid>
      <Grid item xs={defaultItemSize}>
        <DropdownList label="Period" data={showDate} onChange={handleChangePeriodValue}/>
      </Grid>
      <Grid item xs={datePickerSize} style={{display: `${openDatePicker ? "block" : "none"}` }}>
        <DatePicker label="Date Range" onChange={handleDatePickerValue} />
      </Grid>
      {customFilters}
    </Grid>
  )
}
