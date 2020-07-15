import React, { useState } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

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
  },
  selectable: {
    "& .DayPicker-Month": {
      width: "100%",
    },
    "& .DayPicker-Day--start": {
      borderRadius: "100% !important"
    },
    "& .DayPicker-Day--end": {
      borderRadius: "100% !important"
    },
    "& .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside)": {
      opacity: 0.9,
      background: "linear-gradient(0deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), #000000"
    },
    "& .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)": {
      background: "#EC5D5C"
    },
    "& .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover": {
      backgroundColor: "#EC5D5C !important",
      borderRadius: "100% !important"
    }
  }

}))

export default function DatePicker(props) {
  const { label, onChange } = props
  const [pickedDate, setPickedDate] = useState({
    from: undefined,
    to: undefined
  })
  const [openDayPickerTable, setOpenDayPickerTable] = useState(false)
  const styles = useStyles()

  const handleClickAway = () => {
    setOpenDayPickerTable(false)
  }

  const toggleDatePicker = () => {
    setOpenDayPickerTable((prev) => !prev);
  }

  const handleDayClick = (day) => {
    if(from && to) {
      setPickedDate({
        from: day,
        to: undefined
      })
    } else {
      const range = DateUtils.addDayToRange(day, pickedDate)
      setPickedDate(range)
      onChange(range)
      if(range.from !== undefined && range.to !== undefined)
        toggleDatePicker()
    }
  }

    const { from, to } = pickedDate
    const modifiers = { start: pickedDate.from, end: pickedDate.to };

    const selectedDateRange = () => {
      if(!from && !to)
        return 'Please select the first day'
      if (from && !to)
        return 'Please select the last day'
      if(from && to)
        return  `Selected from ${from.toLocaleDateString()} - ${to.toLocaleDateString()}`
    }

    return (
      <ClickAwayListener onClickAway={handleClickAway}>
      <FormControl className={styles.formControl}>
        <TextField
          id='standard-helperText'
          label={label}
          value={selectedDateRange()}
          InputProps={{
            readOnly: true,
          }}
          onClick={toggleDatePicker}
        />

      <div className='RangeExample'>
        <Paper  style={{display: `${openDayPickerTable ? "block" : "none"}` }} 
                className={styles.datePicker}>
          <DayPicker
            className={styles.selectable}
            numberOfMonths={2}
            selectedDays={[from, { from, to }]}
            modifiers={modifiers}
            onDayClick={handleDayClick}
            show={false}
          />
        </Paper>
      </div>
      </FormControl>
      </ClickAwayListener>
    );
}