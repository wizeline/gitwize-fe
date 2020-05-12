export const transformRepositoryStatsApiResponse = data => {
  const dataByDate = {}

  Object.keys(data).forEach(metric => {
    data[metric].forEach(({ asOfDate: date, value }) => {
      dataByDate[date] = dataByDate[date]
        ? { ...dataByDate[date], [metric]: value }
        : { [metric]: value }
    })
  })

  return Object.keys(dataByDate).map(date => ({
    ...dataByDate[date],
    asOfDate: date
  }))
}
