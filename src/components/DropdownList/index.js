import React, { useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem';
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
  select: {
    "&": {
      opacity: 0.8,
      marginTop: '50px',
      top: '67px !important'
    },
    "& ul": {
        backgroundColor: "#000000",
    },
    "& li": {
        fontSize: 12,
        color: '#FFFFFF'
    },
  }
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
        <Select
          value={selectedValue}
          onChange={handleChange}
          inputProps={{
            name: 'name',
            id: 'uncontrolled-native',
          }}
          MenuProps={{ classes: { paper: classes.select } }}
        >
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
  label: PropTypes.string.isRequired
}
