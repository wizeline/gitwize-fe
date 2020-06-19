import React, { useState, useRef, useEffect} from 'react'
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
      top: '0px !important'
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

const marginTopBetweenSelectAndDropdown = 5

export default function DropdownList(props) {
  const {data, label, onChange, value} = props
  const [selectedValue, setSelectedValue] = useState(value ? value : data[0])
  const [topPosition, setTopPosition] = useState('0px');
  const classes = useFilterBarStyles()
  const selectRef = useRef();

  const handleChange = (e) => {
    setSelectedValue(e.target.value)
    onChange(e.target.value)
  }

  useEffect(() => {
    if(selectRef.current) {
      const top = (selectRef.current.offsetParent.offsetTop + selectRef.current.offsetParent.offsetHeight + marginTopBetweenSelectAndDropdown) + 'px';
      setTopPosition(top);
    }
  }, [])
  let newDefaultValue
  if(value) {
    newDefaultValue = ( <MenuItem value={value} key={value}>
                            {value}
                        </MenuItem>)
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="age-native-label-placeholder">
          {label}
        </InputLabel>
        <Select ref={selectRef}
          value={selectedValue}
          onChange={handleChange}
          inputProps={{
            name: 'name',
            id: 'uncontrolled-native',
          }}
          MenuProps={{ classes: { paper: classes.select }, style: {top: topPosition} }}
        >
          {newDefaultValue}
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
