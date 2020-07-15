import React, {useEffect, useRef, useContext, useState} from 'react'
import { useOktaAuth } from '@okta/okta-react'

import PageTitle from '../components/PageTitle'
import { makeStyles } from '@material-ui/core/styles'
import { ApiClient } from '../apis'
import MainLayoutContex from '../contexts/MainLayoutContext'
import { Grid, ListItemText} from '@material-ui/core'
import clsx from 'clsx'
import { buildGridItemsWeeklyImpact } from '../utils/dataUtils'

const information = `Impact measures the magnitude of code changes, and our inhouse formula 
                    takes into consideration more than just lines of code`
const IMPACT_SCORE_TXT = 'Impact score'
const gridItems = [
                    {name: IMPACT_SCORE_TXT, fieldName: 'impactScore'},
                    {name: 'Active days', fieldName: 'activeDays'},
                    {name: 'Commits/day', fieldName: 'commitsPerDay'},
                    {name: 'Most churned file', fieldName: 'mostChurnedFile'},
                  ]

const apiClient = new ApiClient()
const useStyles = makeStyles(() => ({
  root: {
    justifyContent: 'space-between',
    marginBottom: '1vw',
    marginTop: 31
  },
  subContainer: {
    width: '100%',
    height: '30vh'
  },
  gridItem: {
    display: 'flex',
    alignItems: 'start'
  },
  highlightSubGridItem: {
    background: '#5392FF',
    borderRadius: 4,
    color: '#FFFFFF'
  },
  subGridItem: {
    paddingLeft: 34,
  },
  descriptionTxt: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6A707E'
  },
  itemNameTxt: {
    fontSize: 16,
    lineHeight: 24,
    color: '#C4C4C4',
    marginTop: '2vh'
  },
  itemValueTxt: {
    fontSize: 65,
    lineHeight: 97
  },
  itemDiffValueTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 27,
    borderRadius: 7,
    width: '25%',
    textAlign: 'center',
    color: '#FFFFFF'
  },
  itemPreviousTxt: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: '3vh',
    color: '#C4C4C4'
  },
  itemChurnedFileName: {
    fontSize: 14,
    lineHeight: 21,
    wordBreak: 'break-all'
  },
  itemLast: {
    alignSelf: 'flex-end',
    marginBottom: '2vh'
  },
  whiteFontTxt: {
    color: '#FFFFFF'
  }
}))

function WeeklyImpact(props) {
  const {id} = props.match.params;
  const classes = useStyles();
  const { authState } = useOktaAuth();
  const mainLayout = useRef(useContext(MainLayoutContex))
  const [gridItemsState, setGridItems] = useState([])

  useEffect(() => {
      apiClient.setAccessToken(authState.accessToken)
      mainLayout.current.handleChangeRepositoryId(id)
      apiClient.weeklyImpact.getWeeklyImpactStats(id).then((response) => {
        setGridItems(buildGridItemsWeeklyImpact(response, gridItems))
      })
    }, [authState.accessToken, id, mainLayout]
  )

  const gridItemsUI = gridItemsState.map(item => {
    if(item.name !== 'Most churned file') {
      return (<Grid key={item.name} item xs={3} className={clsx(classes.gridItem, classes.subGridItem, 
                                          item.name === IMPACT_SCORE_TXT && classes.highlightSubGridItem)}>
              <Grid container style={{height: '100%'}}>
                <Grid item xs={12}>
                  <ListItemText className={clsx(classes.itemNameTxt, item.name === IMPACT_SCORE_TXT && classes.whiteFontTxt)}>{item.name}</ListItemText>
                </Grid>
                <Grid item xs={12}>
                  <ListItemText className={classes.itemValueTxt}>{item.currentPeriod}</ListItemText>
                </Grid>
                <Grid item xs={12}>
                  <ListItemText className={classes.itemDiffValueTxt} style={{background: item.diffValue > 0 ? '#62C8BA' : '#EC5D5C'}}>{`${item.diffValue > 0 ? '+' : ''}${item.diffValue}`}</ListItemText>
                </Grid>
                <Grid item xs={12} className={classes.itemLast}>
                  <ListItemText className={clsx(classes.itemPreviousTxt, item.name === IMPACT_SCORE_TXT && classes.whiteFontTxt)}>{`From previous period (${item.previousPeriod})`}</ListItemText>
                </Grid>
              </Grid>
            </Grid>)
    } else {
      return (<Grid key={item.name} item xs={3} className={clsx(classes.gridItem, classes.subGridItem)}>
                <Grid container style={{height: '100%'}}>
                  <Grid item xs={12}>
                    <ListItemText className={classes.itemNameTxt}>{item.name}</ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText className={classes.itemChurnedFileName}>{item.fileName}</ListItemText>
                  </Grid>
                  <Grid item xs={12} className={classes.itemLast}>
                    <ListItemText className={classes.itemPreviousTxt}>{`Edited ${item.value} times this week`}</ListItemText>
                  </Grid>
                </Grid>
              </Grid>)
    }
  })

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Weekly Impact</PageTitle>
      <Grid container className={classes.root}>
        <Grid item xs={12} className={classes.gridItem}>
          <ListItemText className={classes.descriptionTxt}>Team accomplishment for the week of Monday 30 April to Sunday 7 May</ListItemText>
        </Grid>
        <Grid item xs={12} className={classes.gridItem} style={{marginTop: '5vh'}}>
          <Grid container className={classes.subContainer}>
            {gridItemsUI}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default WeeklyImpact
