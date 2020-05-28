import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import PropTypes from 'prop-types'

const useFilterBarStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    paddingRight: theme.spacing(5),
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

export default function DropdownList(props) {
  const [selectedValue, setSelectedValue] = useState('')
  const classes = useFilterBarStyles()
  const { data, label, placeholder } = props

  const handleChange = (e) => {
    setSelectedValue(e.target.value)
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="age-native-label-placeholder">
          {label}
        </InputLabel>
        <Select
          labelId="demo-simple-select-placeholder-label-label"
          id="demo-simple-select-placeholder-label"
          value={selectedValue}
          onChange={handleChange}
          displayEmpty
          className={classes.selectEmpty}
        >
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
          {data.map((item) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

DropdownList.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
}
