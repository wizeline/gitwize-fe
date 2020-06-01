import React, { useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/NativeSelect'
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
  const {data, label, onChange, value} = props
  const [selectedValue, setSelectedValue] = useState(value)
  const classes = useFilterBarStyles()

  const handleChange = (e) => {
    setSelectedValue(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="age-native-label-placeholder">
          {label}
        </InputLabel>
        <NativeSelect
          value={selectedValue}
          onChange={handleChange}
          inputProps={{
            name: 'name',
            id: 'uncontrolled-native',
          }}
        >
          {data.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </div>
  )
}

DropdownList.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  label: PropTypes.string.isRequired
}
