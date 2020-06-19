import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components'


const LoadingCircle = styled(CircularProgress)`
  position: absolute;
  width: 100px;
  height: 50px;
  top: 50%;
  left: 50%;
  margin-left: -50px; /* margin is -0.5 * dimension */
  margin-top: -25px; 
`

export default function Loading() {
  return <LoadingCircle />
}