import { List, Map } from 'immutable'

import {
  groupStats,
  shallowCompareMaps,
} from './data'


describe('groupStats', () => {
  it('groups data properly by date', () => {
    const inputData = [
      {
        start: '2019-04-10 10:00:00 UTC',
        end: '2019-04-10 10:10:00 UTC',
        transfers: 10,
        bytes: 100,
      },
      {
        start: '2019-04-10 12:00:00 UTC',
        end: '2019-04-10 12:10:00 UTC',
        transfers: 15,
        bytes: 148,
      },
      {
        start: '2019-04-11 05:00:00 UTC',
        end: '2019-04-11 05:10:00 UTC',
        transfers: 21,
        bytes: 475,
      },
      {
        start: '2019-04-12 14:00:00 UTC',
        end: '2019-04-12 14:10:00 UTC',
        transfers: 3,
        bytes: 3463,
      },
      {
        start: '2019-04-12 15:00:00 UTC',
        end: '2019-04-12 15:10:00 UTC',
        transfers: 9,
        bytes: 497,
      },
    ]
    const groupedData = [
      {
        start: '2019-04-10 10:00:00 UTC',
        end: '2019-04-10 10:10:00 UTC',
        transfers: 10 + 15,
        bytes: 100 + 148,
      },
      {
        start: '2019-04-11 05:00:00 UTC',
        end: '2019-04-11 05:10:00 UTC',
        transfers: 21,
        bytes: 475,
      },
      {
        start: '2019-04-12 14:00:00 UTC',
        end: '2019-04-12 14:10:00 UTC',
        transfers: 3 + 9,
        bytes: 3463 + 497,
      },
    ]
    expect(groupStats(inputData)).toEqual(groupedData)
    expect(groupStats(List(inputData))).toEqual(groupedData)
  })

  it('groups data properly by hour', () => {
    const inputData = [
      {
        start: '2019-04-10 10:00:00 UTC',
        end: '2019-04-10 10:10:00 UTC',
        transfers: 10,
        bytes: 100,
      },
      {
        start: '2019-04-10 10:00:20 UTC',
        end: '2019-04-10 10:10:20 UTC',
        transfers: 15,
        bytes: 148,
      },
      {
        start: '2019-04-10 12:00:00 UTC',
        end: '2019-04-10 12:10:00 UTC',
        transfers: 21,
        bytes: 475,
      },
      {
        start: '2019-04-12 14:00:00 UTC',
        end: '2019-04-12 14:10:00 UTC',
        transfers: 3,
        bytes: 3463,
      },
      {
        start: '2019-04-12 14:00:15 UTC',
        end: '2019-04-12 14:10:30 UTC',
        transfers: 9,
        bytes: 497,
      },
    ]
    const groupedData = [
      {
        start: '2019-04-10 10:00:00 UTC',
        end: '2019-04-10 10:10:00 UTC',
        transfers: 10 + 15,
        bytes: 100 + 148,
      },
      {
        start: '2019-04-10 12:00:00 UTC',
        end: '2019-04-10 12:10:00 UTC',
        transfers: 21,
        bytes: 475,
      },
      {
        start: '2019-04-12 14:00:00 UTC',
        end: '2019-04-12 14:10:00 UTC',
        transfers: 3 + 9,
        bytes: 3463 + 497,
      },
    ]
    expect(groupStats(inputData, false)).toEqual(groupedData)
    expect(groupStats(List(inputData), false)).toEqual(groupedData)
  })
})

describe('shallowCompareMaps', () => {
  it('returns true for maps with same key/value pairs', () => {
    expect(shallowCompareMaps(
      Map({ key1: 10, key2: 'test', key3: null, key4: new Date(2019, 5, 10) }),
      Map({ key1: 10, key2: 'test', key3: null, key4: new Date(2019, 5, 10) })
    )).toEqual(true)
  })

  it('returns false if any one of arguments is null', () => {
    expect(shallowCompareMaps(Map(), null)).toEqual(false)
    expect(shallowCompareMaps(null, Map())).toEqual(false)
    expect(shallowCompareMaps(null, null)).toEqual(false)
  })

  it('returns false for maps with different key/value pairs', () => {
    expect(shallowCompareMaps(
      Map({ key1: 10, key2: 'test', key3: null, key4: new Date(2019, 5, 10) }),
      Map({ key1: 10, key2: 'test', otherkey1: 'abc' })
    )).toEqual(false)
  })

  it('returns false for maps with same keys but one different value', () => {
    expect(shallowCompareMaps(
      Map({ key1: 10, key2: 'test', key3: null, key4: new Date(2019, 5, 10) }),
      Map({ key1: 10, key2: 'test', key3: 'abc', key4: new Date(2019, 5, 10) })
    )).toEqual(false)
  })

  it('returns false for maps with same keys but one different datetime value', () => {
    expect(shallowCompareMaps(
      Map({ key1: 10, key2: 'test', key3: null, key4: new Date(2019, 5, 10) }),
      Map({ key1: 10, key2: 'test', key3: null, key4: new Date(2019, 5, 11) })
    )).toEqual(false)
  })
})
