import React, { useState, useRef, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/Search'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  wrapper: {
    transform: 'translate(-50%, -50%)',
    marginRight: '-25px',
    marginTop: '5px',
  },
  btn: {
    position: 'absolute',
    width: '40px',
    height: '40px',
    background: '#FAFAFA',
    borderRadius: '50%',
    border: '1px solid #3E3E3E',
    right: '45px',
    top: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: '50px',
    fontSize: '20px',
    transition: 'all 0.8s ease',

    '&:hover': {
      textDecoration: 'none',
      background: '#c3c3c3',
    }
  },
  btnAnimation: {
    transform: 'rotate(-360deg)',
    right: '100px',
  },
  input: {
    position: 'absolute',
    top: '14px',
    right: '50px',
    boxSizing: 'border-box',
    width: '0px',
    height: '43px',
    padding: '0 20px',
    outline: 'none',
    fontSize: '18px',
    borderRadius: '50px',
    transition: 'all 0.8s ease',
  },
  inputActive: {
    width: '300px',
    right: '100px',
  },
}))

export default function RepositorySearchBar(props) {
  const { repoList, label, onRepositorySearching } = props
  const [searchTerm, setSearchTerm] = useState(null)
  const refTextField = useRef()
  const refButton = useRef()

  const styles = useStyles()

  useEffect(() => {
    if(repoList !== undefined && searchTerm !== null) {
      const filteredRepos = repoList.filter((repo) => repo.name.toLowerCase().includes(searchTerm.toLowerCase()))
      onRepositorySearching(filteredRepos)
    }
  }, [repoList, searchTerm, onRepositorySearching])

  const handleOnChangeValue = (term) => {
    setSearchTerm(term)
  }

  const toggleButton = () => {
    refTextField.current.focus()
    refTextField.current.classList.toggle(styles.inputActive)
    refButton.current.classList.toggle(styles.btnAnimation)
    setSearchTerm('')
    onRepositorySearching(repoList)
  }

  const handleButtonClick = () => {
    toggleButton()
  }

  return (
    <div className={styles.wrapper}>
      <TextField
        type="text"
        placeholder={label}
        className={styles.input}
        ref={refTextField}
        value={searchTerm}
        onChange={(e) => handleOnChangeValue(e.target.value)}
      />
      <div className={styles.btn} onClick={handleButtonClick} ref={refButton}>
        <SearchIcon />
      </div>
    </div>
  )
}
