import React from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(5)
  }
}))

export default function DatePicker(props) {
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const { label, minDate, maxDate } = props
  const styles = useStyles()

  const handleDateChange = date => {
    setSelectedDate(date)
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        id="date-picker-inline"
        label={label}
        value={selectedDate}
        minDate={minDate}
        maxDate={maxDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date'
        }}
        keyboardIcon={<Icon>arrow_drop_down</Icon>}
        className={styles.root}
      />
    </MuiPickersUtilsProvider>
  )
}

DatePicker.propTypes = {
  label: PropTypes.string.isRequired
}
