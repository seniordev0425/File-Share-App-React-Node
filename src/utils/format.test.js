import {
  formatRelativeTime,
  formatSize,
  parseDate,
  getSiteTitle,
  getUsernameInitials,
  compareValues,
} from './format'
import { Site } from 'store/modules/sites'
import moment from 'moment'

const nowString = '2019-05-10 18:10:25'
const MockDate = (lastDate) => (...args) =>
  new lastDate(...(args.length ? args : [nowString]))

describe('formatSize', () => {
  it('should use B or none when less than 1024', () => {
    expect(formatSize(570)).toEqual('570 B')
    expect(formatSize(570.5)).toEqual('570 B')
    expect(formatSize(570.5, true, 2)).toEqual('570 B')
    expect(formatSize(570, false)).toEqual('570')
    expect(formatSize(570.5, false)).toEqual('570')
  })

  it('should use K when less than 1024^2', () => {
    expect(formatSize(1024 * 102)).toEqual('102 KB')
    expect(formatSize(1024 * 102.5)).toEqual('102 KB')
    expect(formatSize(1024 * 102.5, true, 2)).toEqual('102.5 KB')
    expect(formatSize(1000 * 102, false)).toEqual('102K')
    expect(formatSize(1000 * 102.51, false, 1)).toEqual('102.5K')
  })

  it('should use K when less than 1024^3', () => {
    expect(formatSize(Math.pow(1024, 2) * 37)).toEqual('37 MB')
    expect(formatSize(Math.pow(1024, 2) * 37.3)).toEqual('37 MB')
    expect(formatSize(Math.pow(1024, 2) * 37.3, true, 1)).toEqual('37.3 MB')
    expect(formatSize(Math.pow(1000, 2) * 37, false)).toEqual('37M')
    expect(formatSize(Math.pow(1000, 2) * 37.62, false, 1)).toEqual('37.6M')
  })

  it('should use M when less than 1024^4', () => {
    expect(formatSize(Math.pow(1024, 3) * 286)).toEqual('286 GB')
    expect(formatSize(Math.pow(1024, 3) * 286.33)).toEqual('286 GB')
    expect(formatSize(Math.pow(1024, 3) * 286.33, true, 2)).toEqual('286.33 GB')
    expect(formatSize(Math.pow(1000, 3) * 286, false)).toEqual('286G')
    expect(formatSize(Math.pow(1000, 3) * 286.15, false, 1)).toEqual('286.1G')
  })

  it('should use T when less than 1024^5', () => {
    expect(formatSize(Math.pow(1024, 4) * 948)).toEqual('948 TB')
    expect(formatSize(Math.pow(1024, 4) * 948.25)).toEqual('948 TB')
    expect(formatSize(Math.pow(1024, 4) * 948.25, true, 2)).toEqual('948.25 TB')
    expect(formatSize(Math.pow(1000, 4) * 948, false)).toEqual('948T')
    expect(formatSize(Math.pow(1000, 4) * 948.82, false, 1)).toEqual('948.8T')
  })

  it('should still use T when equal or greater than 1024^5', () => {
    expect(formatSize(Math.pow(1024, 4) * 3756)).toEqual('3756 TB')
    expect(formatSize(Math.pow(1024, 4) * 3756.3)).toEqual('3756 TB')
    expect(formatSize(Math.pow(1024, 4) * 3756.3, true, 1)).toEqual('3756.3 TB')
    expect(formatSize(Math.pow(1000, 4) * 3756, false)).toEqual('3756T')
    expect(formatSize(Math.pow(1000, 4) * 3756.75, false, 1)).toEqual('3756.7T')
  })

  it('should show only available decimals even if less than specified', () => {
    expect(formatSize(1024 * 102.5, true, 3)).toEqual('102.5 KB')
  })
})

describe('parseDate', () => {
  it('should parse date format used in API correctly', () => {
    const date = parseDate('2019-04-12 18:10:25 UTC')
    expect(date.toISOString()).toEqual('2019-04-12T18:10:25.000Z')
  })
})

describe('formatRelativeTime', () => {
  beforeEach(() => {
    global.Date = jest.fn(MockDate(global.Date))
  })

  afterEach(() => {
    global.Date.mockClear();
  })

  it('should return `just now` if time difference is not greater than a second', () => {
    expect(formatRelativeTime('2019-05-10 18:10:24')).toBe('just now')
  })

  it('should return the same as moment.fromNow if time difference is greater than a second', () => {
    expect(formatRelativeTime('2019-05-10 18:10:23')).toBe(moment('2019-05-10 18:10:23').fromNow())
  })
})

describe('getSiteTitle', () => {
  it('should return description if site has valid description', () => {
    const site = Site({ desc: 'Test Site Description' })
    expect(getSiteTitle(site)).toBe('Test Site Description')
  })

  it('should return name if site has valid name but no description', () => {
    const site = Site({ name: 'Test Site', desc: null })
    expect(getSiteTitle(site)).toBe('Test Site')
  })

  it('should return server url if site has neither name nor description', () => {
    const site = Site({ name: null, desc: null, server: 'example.com' })
    expect(getSiteTitle(site)).toBe('example.com')
  })
})

describe('compareValues', () => {
  it('should compare values for ascending order', () => {
    expect(compareValues(10, 20)).toEqual(-1)
    expect(compareValues(15, 11)).toEqual(1)
    expect(compareValues(10, 10)).toEqual(0)

    expect(compareValues('abc', 'def')).toEqual(-1)
    expect(compareValues('car', 'buy')).toEqual(1)
    expect(compareValues('sandy', 'sandy')).toEqual(0)

    expect(compareValues(true, false)).toEqual(1)
    expect(compareValues(false, true)).toEqual(-1)
    expect(compareValues(true, true)).toEqual(0)
    expect(compareValues(false, false)).toEqual(0)
  })

  it('should compare values for descending order', () => {
    expect(compareValues(10, 20, false)).toEqual(1)
    expect(compareValues(15, 11, false)).toEqual(-1)
    expect(compareValues(10, 10, false)).toEqual(0)

    expect(compareValues('abc', 'def', false)).toEqual(1)
    expect(compareValues('car', 'buy', false)).toEqual(-1)
    expect(compareValues('sandy', 'sandy', false)).toEqual(0)

    expect(compareValues(true, false, false)).toEqual(-1)
    expect(compareValues(false, true, false)).toEqual(1)
    expect(compareValues(true, true, false)).toEqual(0)
    expect(compareValues(false, false, false)).toEqual(0)
  })
})

describe('getUsernameInitials', () => {
  it('should return the initals of first name and last name', () => {
    const user = { first_name: 'John', last_name: 'Doe' }
    expect(getUsernameInitials(user)).toBe('JD')
  })

  it('should return the initial letter of email if neither first nor last name exists', () => {
    const user = { email_address: 'john.doe@email.com' }
    expect(getUsernameInitials(user)).toBe('J')
  })
})
