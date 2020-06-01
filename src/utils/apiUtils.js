import { DateTime } from 'luxon'

export const convertApiKeyName = (name) => {
  switch (name) {
    case 'commits':
      return 'Commits'
    case 'lines_added':
      return 'Additions'
    case 'lines_removed':
      return 'Deletions'
    case 'prs':
      return 'Pull requests'
    case 'loc':
      return 'Total lines of code'
    case 'prs_created':
      return 'Created'
    case 'prs_merged':
      return 'Merged'
    case 'prs_rejected':
      return 'Rejected'
    default:
      return 'No thing'
  }
}

export const calculateChangePercent = (additions, deletions, loc) => {
  return (((additions + deletions) / loc) * 100).toFixed(2)
}

export const transformRepositoryStatsApiResponse = (data) => {
  const dataByDate = {}
  const dataFields = ['Commits', 'Additions', 'Deletions', 'Total lines of code', 'Created', 'Merged', 'Rejected']

  Object.keys(data).forEach((metric) => {
    data[metric].forEach(({ as_of_date: date, value }) => {
      date = DateTime.fromISO(date).toLocaleString()
      dataByDate[date] = dataByDate[date]
        ? { ...dataByDate[date], [convertApiKeyName(metric)]: value }
        : { [convertApiKeyName(metric)]: value }
    })
  })

  Object.keys(dataByDate).forEach((date) => {
    dataFields.forEach((field) => {
      if (!dataByDate[date].hasOwnProperty(field)) {
        dataByDate[date][field] = 0
        return dataByDate[date]
      }
    })
  })

  const dataOrderedByDate = {}
  Object.keys(dataByDate)
    .sort()
    .reverse()
    .forEach((date) => {
      dataOrderedByDate[date] = dataByDate[date]
    })

  return Object.keys(dataOrderedByDate).map((date) => ({
    Date: date,
    ...dataOrderedByDate[date],
    'Change percent %': calculateChangePercent(
      dataOrderedByDate[date].Additions,
      dataOrderedByDate[date].Deletions,
      dataOrderedByDate[date]['Total lines of code']
    ),
  }))
}
