import moment from 'moment'

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