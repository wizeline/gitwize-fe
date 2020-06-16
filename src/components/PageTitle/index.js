import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Tooltip from '@material-ui/core/Tooltip';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Grid from '@material-ui/core/Grid'


const Title = styled.h1`
  margin-top: 5px !important;
  font-size: 30px;
`

export default function PageTitle({ children, information }) {
  let infoIcon;
  if(information) {
    infoIcon = ( <Tooltip title={information} placement='right-end' arrow enterDelay={500} enterNextDelay={500}>
                    <InfoOutlinedIcon style={{marginLeft: 10}}/>        
                  </Tooltip>)
  }
  return (
    <Grid container>
      <Grid item xs={12}>
        <Title>
          {children}
          {infoIcon}
        </Title>
      </Grid>
    </Grid>

  )
}

PageTitle.propTypes = {
  children: PropTypes.string.isRequired,
}
