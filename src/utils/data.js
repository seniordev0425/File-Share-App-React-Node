import { parseDate, formatDateForServer } from 'utils/format'


const areEqualDates = (date1, date2, byDate = true) => {
  if (
    date1.dayOfYear() !== date2.dayOfYear() ||
    date1.year() !== date2.year()
  ) {
    return false
  }
  if (!byDate && (
    date1.hour() !== date2.hour() ||
    date1.minute() !== date2.minute()
  )) {
    return false
  }
  return true
}

export const groupStats = (data, byDate = true) => {
  if (!data) {
    return data
  }
  const dataSize = data.size || data.length
  const newData = []
  let currentStart, currentEnd
  let transfers = 0
  let bytes = 0
  data.forEach((record, index) => {
    const date = parseDate(record.start)

    if (!currentStart || !areEqualDates(currentStart, date, byDate)) {
      if (currentStart) {
        newData.push({
          start: formatDateForServer(currentStart),
          end: formatDateForServer(currentEnd),
          transfers,
          bytes,
        })
      }
      currentStart = date
      currentEnd = parseDate(record.end)
      transfers = 0
      bytes = 0
    }

    transfers += parseInt(record.transfers)
    bytes += parseInt(record.bytes)

    if (currentStart && index === dataSize - 1) {
      newData.push({
        start: formatDateForServer(currentStart),
        end: formatDateForServer(currentEnd),
        transfers,
        bytes,
      })
    }
  })
  return newData
}

export const shallowCompareMaps = (map1, map2) => {
  if (!map1 || !map2) {
    return false
  }
  const keys = map1.keySeq()
  if (keys.size !== map2.keySeq().size) {
    return false
  }
  const diffEntry = map1.findEntry((value, key) => {
    if (value && value.constructor === Date) {
      const map2Value = map2.get(key)
      if (!map2Value || map2Value.constructor !== Date) {
        return false
      }
      return value.getTime() !== map2Value.getTime()
    }
    return value !== map2.get(key)
  })
  return !diffEntry
}

export const randomString = length => {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let str = ''
  while (str.length < length) {
    const index = Math.floor(Math.random() * charSet.length)
    str += charSet.charAt(index)
  }
  return str
}
