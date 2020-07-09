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

export const getNumberOfMonthBackward = (date, monthBackward) => {
    return moment(date).subtract(monthBackward, 'month')
}

export const getNumberOfMonthForward = (date, monthsForward) => {
    return moment(date).add(monthsForward, 'month')
}

export const getMonth = (date) => {
    return moment(date).month() + 1
}