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
      top: '0px !important',
      maxHeight: '70vh'
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
  const {label, onChange, initValue, data=[]} = props
  const [selectedValue, setSelectedValue] = useState(initValue ? initValue : data[0])
  const [topPosition, setTopPosition] = useState('0px');
  const classes = useFilterBarStyles()
  const selectRef = useRef();

  const handleChange = (e) => {
    setSelectedValue(e.target.value)
    onChange(e.target.value)
  }

  useEffect(() => {
    if(selectRef.current && selectRef.current.offsetParent) {
      const top = (selectRef.current.offsetParent.offsetTop + selectRef.current.offsetParent.offsetHeight + marginTopBetweenSelectAndDropdown) + 'px';
      setTopPosition(top);
    }
  }, [])
  let newDefaultValue
  let foundIndex = -1;
  if(data && data.length > 0) {
    foundIndex = data.findIndex(item => item === initValue)
    
    //if selected value is not in list data. Refresh selectedValue
    const selectedValueIndex = data.findIndex(item => item === selectedValue)
    if(selectedValueIndex === -1) {
      setSelectedValue(initValue)
    }
  }
  if(initValue && foundIndex === -1) {
    newDefaultValue = ( <MenuItem value={initValue} key={initValue}>
                            {initValue}
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
          MenuProps={{ classes: { paper: classes.select }, style: {position:'absolute', top: topPosition} }}
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
