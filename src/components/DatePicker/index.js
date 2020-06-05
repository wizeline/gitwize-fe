import React, { useState } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    paddingRight: theme.spacing(5),
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  datePicker: {
    position: 'absolute',
    zIndex: 99,
    background: 'rgba(0, 0, 0, 0.85)',
    color: '#ffff',
    marginTop: '10px'
  }
}))

export default function DatePicker() {
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined
  })
  const [openDatePicker, setOpenDatePicker] = useState(false)

  const styles = useStyles()
  
  const getInitialState = () => {
    return {
      from: undefined,
      to: undefined,
    };
  }

  const handleDayClick = (day) => {
    const range = DateUtils.addDayToRange(day, dateRange)
    if(range.to !== undefined)
      setOpenDatePicker(false)
    setDateRange(range);
  }

  const handleResetClick = () => {
    setDateRange(getInitialState)
  }

  const toggleDatePicker = () => {
    setOpenDatePicker(!openDatePicker)
  }

    const { from, to } = dateRange
    const modifiers = { start: from, end: to };

    const selectedDateRange = () => {
      if(!from && !to)
        return 'Please select the first day'
      if (from && !to)
        return 'Please select the last day'
      if(from && to)
        return  `Selected from ${from.toLocaleDateString()} - ${to.toLocaleDateString()}`
    }

    return (
      <FormControl className={styles.formControl}>
        <TextField
          id='standard-helperText'
          label={'Date range'}
          value={selectedDateRange()}
          InputProps={{
            readOnly: true,
          }}
          onClick={toggleDatePicker}
        />

      <div className='RangeExample'>
        <Paper style={{display: `${openDatePicker ? "block" : "none"}` }} 
          className={styles.datePicker}>
        <DayPicker
          className='Selectable'
          numberOfMonths={2}
          selectedDays={[from, { from, to }]}
          modifiers={modifiers}
          onDayClick={handleDayClick}
          show={false}
        />
        </Paper>
          <style>{`
  .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
    opacity: 0.9;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), #000000;
  }
  .Selectable .DayPicker-Day {
    border-radius: 0 !important;
  }
  .Selectable .DayPicker-Day--start {
    border-radius: 100% !important;
  }
  .Selectable .DayPicker-Day--end {
    border-radius: 100% !important;
  }
  .Selectable .DayPicker-Month {
    width: 100%
  }

  .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
    background: #EC5D5C;
  }

`}</style>
      </div>
      </FormControl>
    );
}