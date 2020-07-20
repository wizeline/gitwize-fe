import moment from 'moment'

const ddddDDMM_FORMAT = 'dddd DD MMMM'

export const getCurrentDate = () => {
    return moment();
}

export const getStartOfMonth = (date) => {
    return moment(date).startOf('month')
}

export const getEndOfMonth = (date) => {
    return moment(date).endOf('month')
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
    const monthArrays = [];
    monthsName.forEach(monthName => {
        monthArrays.push(moment().month(monthName).format("M"))
    })
    return monthArrays
}

export const formatToMMDD = (dateString) => {
    return moment(dateString).format(ddddDDMM_FORMAT)
}

export const getStartOfDateInSecond = (dateString) => {
    const date = new Date(dateString * 1000)
    return  Math.floor(date.setUTCHours(0, 0, 0, 0) / 1000)
}

export const getEndOfDateInSecond = (dateString) => {
    const date = new Date(dateString * 1000)
    return Math.floor(date.setUTCHours(23, 59, 59, 59) / 1000)
}