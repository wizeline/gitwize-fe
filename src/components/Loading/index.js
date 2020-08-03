import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import { styled } from '@material-ui/core/styles'

const LoadingCircle = styled(CircularProgress)({
  position: 'absolute',
  width: '100px',
  height: '50px',
  top: '50%',
  left: '50%',
  marginLeft: '-50px', /* margin is -0.5 * dimension */
  marginTop: '-25px' 
})


export default function Loading() {
  return <LoadingCircle />
}