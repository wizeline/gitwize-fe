export const convertApiKeyName = name => {
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
    default:
      return 'No thing'
  }
}

export const transformRepositoryStatsApiResponse = data => {
  const dataByDate = {}

  Object.keys(data).forEach(metric => {
    data[metric].forEach(({ asOfDate: date, value }) => {
      dataByDate[date] = dataByDate[date]
        ? { ...dataByDate[date], [convertApiKeyName(metric)]: value }
        : { [convertApiKeyName(metric)]: value }
    })
  })

  return Object.keys(dataByDate).map(date => ({
    ...dataByDate[date],
    Date: date
  }))
}
