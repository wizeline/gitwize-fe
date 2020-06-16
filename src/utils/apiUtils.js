export const convertDateToSecond = (date) => {
  return Math.floor(date.getTime()/1000)
}


export const calculateChangePercent = (additions, deletions, loc) => {
  return loc ? (((additions + deletions) / loc) * 100).toFixed(2) : 0
}

export const transformMetricsDataApiResponse = (data, dateRange) => {
  let { date_from, date_to } = dateRange
  date_from = convertDateToSecond(date_from)
  date_to = convertDateToSecond(date_to)
  const dataByDate = {}

  Object.keys(data).forEach((metric) => {
    if(data[metric] !== null) {
      data[metric].forEach(({ as_of_date: date, value }) => {
        dataByDate[date] = dataByDate[date]
          ? { ...dataByDate[date], [metric]: value }
          : { [metric]: value }
      })
    }
  })

  const dateList = []
  while(date_from <= date_to) {
    const date = (new Date(date_from*1000)).toLocaleDateString()
    
    const metricByDate = dataByDate[date] ? dataByDate[date] : {}

    dateList.push({
      Date: date,
      Commits: metricByDate.commits ? metricByDate.commits : 0,
      Additions: metricByDate.lines_added !== undefined ? metricByDate.lines_added : 0,
      Deletions: metricByDate.lines_removed !== undefined ? metricByDate.lines_removed : 0,
      Open: metricByDate.prs_created !== undefined ? metricByDate.prs_created : 0,
      Merged: metricByDate.prs_merged !== undefined ? metricByDate.prs_merged : 0,
      Rejected:metricByDate.prs_rejected !== undefined ? metricByDate.prs_rejected : 0
    })

    date_from = date_from + (24*3600)
  }

  return dateList
}

export const getRepositoryNameFromGitHubUrl = (url) => {
  const splittedUrl = url.split("/")
  const finalPart = splittedUrl[splittedUrl.length - 1]

  const repoName = finalPart.replace(".git", "")
  
  return repoName === null ? url : repoName
}
