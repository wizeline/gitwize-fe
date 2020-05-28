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

  Object.keys(data).forEach((metric) => {
    data[metric].forEach(({ as_of_date: date, value }) => {
      date = DateTime.fromISO(date).toLocaleString()
      dataByDate[date] = dataByDate[date]
        ? { ...dataByDate[date], [convertApiKeyName(metric)]: value }
        : { [convertApiKeyName(metric)]: value }
    })
  })

  return Object.keys(dataByDate).map((date) => ({
    Date: date,
    ...dataByDate[date],
    'Change percent %': calculateChangePercent(
      dataByDate[date].Additions,
      dataByDate[date].Deletions,
      dataByDate[date]['Total lines of code']
    ),
  }))
}
