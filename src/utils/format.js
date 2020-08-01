import moment from 'moment'


const addUnit = (number, unit, useByteUnit, decimals) => {
  let result = number.toString().replace(
    /\.\d+$/,
    pattern => unit ? pattern.substr(0, decimals ? decimals + 1 : 0) : ''
  )
  useByteUnit && (result += ' ')
  result += unit
  useByteUnit && (result += 'B')
  return result
}

export const formatSize = (size, useByteUnit = true, decimals = 0) => {
  const base = useByteUnit ? 1024 : 1000
  const units = ['', 'K', 'M', 'G', 'T']

  for (let i = 0; i < units.length; i += 1) {
    const maxSizeForUnit = Math.pow(base, i)
    if (size < base * maxSizeForUnit) {
      return addUnit(size / maxSizeForUnit, units[i], useByteUnit, decimals)
    }
  }

  return addUnit(
    size / Math.pow(base, units.length - 1),
    units[units.length - 1],
    useByteUnit,
    decimals
  )
}

export const parseDate = (dateString) => {
  return moment(dateString.replace(' UTC', '+00:00'), 'YYYY-MM-DD HH:mm:ssZ')
}

export const formatRelativeTime = (dt) =>
  moment().diff(dt, 'seconds') > 1 ? moment(dt).fromNow() : 'just now'

export const NOTIFICATION_COLOR_CLASSNAMES = {
  notice: 'text-f-color7',
  info: 'text-f-color7',
  warning: 'text-f-color4',
  success: 'text-f-color2',
  error: 'text-f-color6',
  danger: 'text-f-color6',
}

export const getNotificationColorClassname = type => NOTIFICATION_COLOR_CLASSNAMES[type] || NOTIFICATION_COLOR_CLASSNAMES.notice

export const getSiteTitle = (site) =>
  site.desc || site.name || site.server

export const compareValues = (value1, value2, ascending = true) => {
  let orderValue = 0
  if (value1 < value2) {
    orderValue = -1
  } else if (value1 > value2) {
    orderValue = 1
  }
  if (orderValue && !ascending) {
    orderValue = -orderValue
  }
  return orderValue
}

export const formatDateForServer = date => moment(date).utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC'

export const getUsernameInitials = (user) => {
  if (user.first_name && user.last_name) {
    return user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0).toUpperCase()
  }
  return user.email_address.charAt(0).toUpperCase()
}
