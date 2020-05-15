import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Title = styled.h1`
  font-size: 30px;
`

export default function PageTitle({ children }) {
  return <Title>{children}</Title>
}

PageTitle.propTypes = {
  children: PropTypes.string.isRequired
}
