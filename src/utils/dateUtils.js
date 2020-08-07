import moment from 'moment'

const ddddDDMM_FORMAT = 'dddd DD MMMM'

export const getCurrentDate = () => {
  return moment()
}

export const getStartOfMonth = (date) => {
  return moment(date).utcOffset('Z').startOf('month')
}

export const getEndOfMonth = (date) => {
  return moment(date).utcOffset('Z').endOf('month')
}

export const getNumberOfMonthBackward = (date, monthsBackward) => {
  return moment(date).subtract(monthsBackward, 'month')
}

export const getNumberOfMonthForward = (date, monthsForward) => {
  return moment(date).add(monthsForward, 'month')
}

export const getMonth = (date) => {
  return moment(date).month() + 1
}

export const getMonthNumberFromMonthName = (monthsName = []) => {
  const monthArrays = []
  monthsName.forEach((monthName) => {
    monthArrays.push(moment().month(monthName).format('M'))
  })
  return monthArrays
}

export const formatToMMDD = (dateString) => {
  return moment(dateString).format(ddddDDMM_FORMAT)
}

export const getStartOfDateInSecond = (dateString) => {
  const date = new Date(dateString * 1000)
  return Math.floor(date.setUTCHours(0, 0, 0, 0) / 1000)
}

export const getEndOfDateInSecond = (dateString) => {
  const date = new Date(dateString * 1000)
  return Math.floor(date.setUTCHours(23, 59, 59, 59) / 1000)
}

export const calculateDateRangeQuarterlyTrendsAndCodeChangeVelocity = () => {
  const currentDate = getCurrentDate()
  const twoMonthsBackward = getNumberOfMonthBackward(Object.assign(currentDate), 2)
  const endOfCurrentMonth = getEndOfMonth(currentDate)
  const startOfMonthFrom = getStartOfMonth(twoMonthsBackward)
  return {
    date_from: startOfMonthFrom.unix(),
    date_to: endOfCurrentMonth.unix(),
  }
}

export const getDayStartOfWeekPointOfTime = (date) => {
	return moment(date).utcOffset('Z').startOf('isoWeek')
}

export const getDayStartOfCurrentWeek = () => {
	const currentDate = getCurrentDate()
	return getDayStartOfWeekPointOfTime(currentDate)
}

export const addNumberOfDays = (date, numberOfDays) => {
	const tempDate = Object.assign(date)
	return moment(tempDate).add(numberOfDays, 'day')
}
