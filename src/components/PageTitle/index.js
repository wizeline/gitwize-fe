import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from '@material-ui/core/Tooltip';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Grid from '@material-ui/core/Grid'
import { makeStyles ,styled} from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  tooltip: {
    background: '#000000',
    fontSize: 12,
    padding: '35px 40px 40px 26px',
    marginRight: '10vw',
    borderRadius: 8,
    minHeight: 100,
    whiteSpace: 'pre-line'
  }
}))

const Title = styled('h1')({
  marginTop: '20px !important',
  fontSize: '30px'
})

export default function PageTitle({ children, information }) {
  let infoIcon;
  const classes = useStyles()
  if(information) {
    infoIcon = ( <Tooltip title={information} placement='bottom-start' enterDelay={500} enterNextDelay={500} classes={{tooltip: classes.tooltip}}>
                    <InfoOutlinedIcon/>        
                  </Tooltip>)
  }

  return (
    <Grid container>
      <Grid item xs={10}>
        <Title>
          {children}
        </Title>
      </Grid>
      <Grid item xs={2}>
        <Title>
          {infoIcon}
        </Title>
      </Grid>
    </Grid>

  )
}

PageTitle.propTypes = {
  children: PropTypes.string.isRequired,
}
