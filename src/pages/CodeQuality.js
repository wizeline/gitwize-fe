import React, { useEffect, useRef, useContext, useState } from 'react'
import { useOktaAuth } from '@okta/okta-react'
import PageTitle from '../components/PageTitle'
import { ApiClient } from '../apis'
import MainLayoutContex from '../contexts/MainLayoutContext'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, ListItemText, Paper } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import Avatar from '@material-ui/core/Avatar'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'

const information = `This section displays following insights from SonarQube
\n- Overall code quality rating
\n- Additional ratings from reliability, maintainability and security perspectives.
\n- Details and drill-downs of various other metrics like code smells, code coverage, duplications, complexity etc.`

const qualityGateToolTip = `A Quality Gate is a set of measure-based Boolean conditions. It helps you know immediately whether your project is production-ready. 
If your current status is not Passed, you'll see which measures caused the problem and the values required to pass.`

const qualityItems = [
  {
    name: 'Reliability',
    tooltip: `Issues in this domain mark code where you will get behavior other than what was expected.`,
    childrend: [
      {
        name: 'Bugs',
        tooltip: `A coding error that will break your code and needs to be fixed immediately.`,
        isRating: true,
        fieldName: 'bugs',
        ratingTooltip: {
          A: 'Reliability rating is A when there are no bugs.',
          B: 'Reliability rating is B when there is at least 1 minor bug',
          C: 'Reliability rating is C when there is at least one major bug.',
          D: 'Reliability rating is D when there is at least 1 critical bug',
          E: 'Reliability rating is E when there is at least 1 blocker bug',
        },
      },
    ],
  },
  {
    name: 'Security',
    tooltip: `Issues in this domain mark potential weaknesses to hackers.`,
    childrend: [
      {
        name: 'Vulnerabilities',
        tooltip: `Code that can be exploited by hackers.`,
        isRating: true,
        fieldName: 'vulnerabilities',
        ratingTooltip: {
          A: 'Security rating is A when there are no vulnerabilities.',
          B: 'Security rating is B when there is at least 1 minor vulnerability.',
          C: 'Security rating is C when there is at least 1 major vulnerability.',
          D: 'Security rating is D when there is at least 1 critical vulnerability',
          E: 'Security rating is E when there is at least 1 blocker vulnerability',
        },
      },
      {
        name: 'Security Hotspots',
        tooltip: `Security-sensitive code that requires manual review to assess whether or not a vulnerability exists.`,
        fieldName: 'securityHotspots',
      },
    ],
  },
  {
    name: 'Maintainability',
    tooltip: `Issues in this domain mark code that will be more difficult to update competently than it should.`,
    childrend: [
      {
        name: 'Technical Debt',
        tooltip: `The estimated time it will take to fix all Code Smells.`,
        isRating: true,
        fieldName: 'technicalDebt',
        unit: 'hr',
        ratingTooltip: {
          A: 'Maintainability rating is A when the technical debt ratio is less than 5.0%',
          B: 'Maintainability rating is B when the technical debt ratio is between 6 to 10%',
          C: 'Maintainability rating is C when the technical debt ratio is between 11 to 20%',
          D: 'Maintainability rating is D when the technical debt ratio is between 21 to 50%',
          E: 'Maintainability rating is E when the technical debt ratio is over 50%',
        },
      },
      {
        name: 'Code Smells',
        tooltip: `Code that is confusing and difficult to maintain.`,
        fieldName: 'codeSmells',
      },
    ],
  },
  {
    name: 'Coverage',
    tooltip: `The percentage of lines of code covered by tests.`,
    childrend: [
      {
        name: 'Coverage',
        tooltip: `The percentage of lines of code covered by tests.`,
        fieldName: 'codeCoveragePercentage',
        unit: '%',
      },
    ],
  },
  {
    name: 'Duplications',
    tooltip: `Identical lines of code.`,
    childrend: [
      {
        name: 'Duplications',
        tooltip: `Identical lines of code.`,
        fieldName: 'duplicationPercentage',
        unit: '%',
      },
      {
        name: 'Duplicated blocks',
        tooltip: `The number of duplicated blocks of lines of code.`,
        fieldName: 'duplicationBlocks',
      },
    ],
  },
  {
    name: 'Complexity',
    tooltip: `How simple or complicated the control flow of the application is.`,
    childrend: [
      {
        name: 'Cognitive complexity',
        tooltip: `Cognitive Complexity is a measure of how difficult the application is to understand`,
        fieldName: 'cognitiveComplexity',
      },
      {
        name: 'Cyclomatic complexity',
        tooltip: `Cyclomatic Complexity measures the minimum number of test cases required for full test coverage.`,
        fieldName: 'cyclomaticComplexity',
      },
    ],
  },
]

const backGroundColorRating = {
  A: '#62C8BA',
  B: '#7DA7A1',
  C: '#EFCA08',
  D: '#FF9901',
  E: '#EC5D5C',
}

const apiClient = new ApiClient()
const useStyles = makeStyles(() => ({
  root: {
    justifyContent: 'space-between',
    marginBottom: '1vw',
    marginTop: 40,
    width: '100%',
  },
  tooltip: {
    background: '#000000',
    fontSize: 12,
    padding: '35px 40px 40px 26px',
    marginRight: '10vw',
    borderRadius: 8,
    minHeight: 100,
    whiteSpace: 'pre-line',
  },
  headerTxt: {
    fontSize: '1vw',
    fontWeight: 'bold',
  },
  headerTooltipIcon: {
    marginLeft: '1vw',
  },
  qualityGateGrid: {
    alignItems: 'center',
  },
  qualityGateChip: {
    color: 'white',
    width: '6vw',
    fontSize: '0.8vw',
  },
  qualityItemGrid: {
    marginTop: '5vh',
  },
  paperItem: {
    height: '31vh',
    width: '100%',
  },
  subHeaderTxt: {
    fontSize: '1.75vh',
    fontWeight: 500,
    margin: '3vh 0px 0px 3vh',
  },
  subTooltipIcon: {
    margin: '3vh 0px 0px 3vh',
  },
  valueTxt: {
    textAlign: 'center',
    fontSize: '8.7vh',
    fontWeight: 'bold',
  },
  ratingIcon: {
    color: 'white',
    width: '3vh',
    height: '3vh',
    fontSize: '1.7vh',
  },
  accordionStyle: {
    width: '100%',
    boxShadow: 'unset',
    background: 'unset',
  },
  accordionSummaryContent: {
    alignItems: 'center',
  },
  ratingIconToolTip: {
    color: 'white',
    width: '2vh',
    height: '2vh',
    fontSize: '1vh',
    float: 'left'
  }
}))

const buildTooltipRating = (ratingTxt, ratingType, classes) => {
  return (
    <>
      <Avatar className={classes.ratingIconToolTip} style={{ background: backGroundColorRating[ratingType] }}>
        {ratingType}
      </Avatar>
      <div style={{marginLeft: '1.5vw'}}>{ratingTxt}</div>
    </>
  )
}

function CodeQuality(props) {
  const { pageTitle } = props
  const { id } = props.match.params
  const { authService } = useOktaAuth()
  const mainLayout = useRef(useContext(MainLayoutContex))
  const [response, setResponse] = useState()
  const classes = useStyles()

  useEffect(() => {
    apiClient.setAuthService(authService)
    mainLayout.current.handleChangeRepositoryId(id)
    apiClient.codeQuality.getCodeQualityStats(id).then((response) => {
      setResponse(response)
    })
  }, [id, authService])

  const buildCodeQuality = () => {
    if (response) {
      return qualityItems.map((qualityItem) => {
        const children = qualityItem.childrend
        return (
          <Grid key={qualityItem.name} item xs={12} className={classes.qualityItemGrid}>
            <Grid container spacing={2} className={classes.qualityGateGrid}>
              <Accordion className={classes.accordionStyle} defaultExpanded={true}>
                <AccordionSummary classes={{ content: classes.accordionSummaryContent }}>
                  <Grid item>
                    <ListItemText disableTypography className={classes.headerTxt}>
                      {qualityItem.name}
                    </ListItemText>
                  </Grid>
                  <Grid item>
                    <Tooltip
                      title={qualityItem.tooltip}
                      placement="bottom-start"
                      enterDelay={500}
                      enterNextDelay={500}
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <InfoOutlinedIcon className={classes.headerTooltipIcon} />
                    </Tooltip>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {children.map((child) => {
                        const xsSize = 12 / children.length
                        let value = ''
                        let rating = ''
                        if (child.isRating) {
                          const objectValue = response[child.fieldName]
                          value = objectValue.value
                          rating = objectValue.rating
                        } else {
                          value = response[child.fieldName]
                        }

                        if (child.name === 'Technical Debt') {
                          value = (value / 60).toFixed(1)
                        }
                        return (
                          <Grid key={child.name} item xs={xsSize}>
                            <Paper className={classes.paperItem}>
                              <Grid container style={{ height: 'inherit' }}>
                                <Grid item xs={10}>
                                  <ListItemText disableTypography className={classes.subHeaderTxt}>
                                    {child.name}
                                  </ListItemText>
                                </Grid>
                                <Grid item xs={2}>
                                  <Tooltip
                                    title={child.tooltip}
                                    placement="bottom-start"
                                    enterDelay={500}
                                    enterNextDelay={500}
                                    classes={{ tooltip: classes.tooltip }}
                                  >
                                    <InfoOutlinedIcon className={classes.subTooltipIcon} />
                                  </Tooltip>
                                </Grid>
                                <Grid item xs={12}>
                                  <Grid container style={{ justifyContent: 'center' }}>
                                    <Grid item>
                                      <ListItemText disableTypography className={classes.valueTxt}>
                                        {value} {child.unit ? child.unit : ''}
                                      </ListItemText>
                                    </Grid>
                                    <Grid item>
                                      {child.isRating && (
                                        <Tooltip
                                          title={buildTooltipRating(child.ratingTooltip[rating], rating, classes)}
                                          placement="bottom-start"
                                          enterDelay={500}
                                          enterNextDelay={500}
                                          classes={{ tooltip: classes.tooltip }}
                                        >
                                          <Avatar
                                            className={classes.ratingIcon}
                                            style={{ background: backGroundColorRating[rating] }}
                                          >
                                            {rating}
                                          </Avatar>
                                        </Tooltip>
                                      )}
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Paper>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        )
      })
    }
  }

  const codeQualityView = buildCodeQuality()
  const qualityGate = response ? (
    <Grid item xs={12}>
      <Grid container spacing={2} className={classes.qualityGateGrid}>
        <Grid item>
          <ListItemText disableTypography className={classes.headerTxt}>
            Quality Gates
          </ListItemText>
        </Grid>
        <Grid item>
          <Tooltip
            title={qualityGateToolTip}
            placement="bottom-start"
            enterDelay={500}
            enterNextDelay={500}
            classes={{ tooltip: classes.tooltip }}
          >
            <InfoOutlinedIcon />
          </Tooltip>
        </Grid>
        <Grid item style={{ marginLeft: '3vw' }}>
          <Chip
            size="small"
            label={response.qualityGates === 'failed' ? 'Failed' : 'Passed'}
            classes={{ sizeSmall: classes.qualityGateChip }}
            style={{ background: response.qualityGates === 'failed' ? '#EC5D5C' : '#62C8BA' }}
          />
        </Grid>
      </Grid>
    </Grid>
  ) : undefined

  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>{pageTitle}</PageTitle>
      <Grid container className={classes.root}>
        {qualityGate}
        {codeQualityView}
      </Grid>
    </div>
  )
}

export default CodeQuality
