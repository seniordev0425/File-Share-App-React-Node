import { Map, Record } from 'immutable'

import { REQUEST_STATUS, EXPIRATION_STATUS } from 'constants/common'
import { ListData, DetailData } from 'store/common/models'
import { selectIsRefreshing } from './selectors'


/* module == sub store == reducer */

const Module1 = Record({
  module1_field1: ListData(),
  module1_field2: DetailData(),
  module1_field3: '',
})

const Module2 = Record({
  module2_field1: DetailData(),
  module2_field2: 0,
})

it('isRefreshing should be false for initial states', () => {
  const dummyStore = Map({
    module1: Module1(),
    module2: Module2(),
  })

  const isRefreshing = selectIsRefreshing(dummyStore)
  expect(isRefreshing).toBe(false)
})

it('isRefreshing should be false when some data loaded', () => {
  let dummyStore = Map({
    module1: Module1(),
    module2: Module2(),
  })
  dummyStore = dummyStore
    .setIn(['module1', 'module1_field1', 'state'], REQUEST_STATUS.SUCCESS)
    .setIn(['module2', 'module2_field1', 'state'], REQUEST_STATUS.SUCCESS)

  const isRefreshing = selectIsRefreshing(dummyStore)
  expect(isRefreshing).toBe(false)
})

it('isRefreshing should be true when data is loaded and refreshing', () => {
  let dummyStore = Map({
    module1: Module1(),
    module2: Module2(),
  })
  dummyStore = dummyStore
    .setIn(['module1', 'module1_field1', 'state'], REQUEST_STATUS.SUCCESS)
    .setIn(['module1', 'module1_field1', 'expirationStatus'], EXPIRATION_STATUS.REFRESHING)
    .setIn(['module1', 'module1_field2', 'state'], REQUEST_STATUS.SUCCESS)
    .setIn(['module1', 'module1_field2', 'expirationStatus'], EXPIRATION_STATUS.EXPIRED)
    .setIn(['module2', 'module2_field1', 'state'], REQUEST_STATUS.PENDING)
    .setIn(['module1', 'module2_field1', 'expirationStatus'], EXPIRATION_STATUS.REFRESHING)

  const isRefreshing = selectIsRefreshing(dummyStore)
  expect(isRefreshing).toBe(true)
})

it('isRefreshing should be false when data is set as refreshing but not loaded', () => {
  let dummyStore = Map({
    module1: Module1(),
    module2: Module2(),
  })
  dummyStore = dummyStore
    .setIn(['module1', 'module1_field1', 'state'], REQUEST_STATUS.FAIL)
    .setIn(['module1', 'module1_field1', 'expirationStatus'], EXPIRATION_STATUS.REFRESHING)
    .setIn(['module1', 'module1_field2', 'state'], REQUEST_STATUS.INITIAL)
    .setIn(['module1', 'module1_field2', 'expirationStatus'], EXPIRATION_STATUS.REFRESHING)
    .setIn(['module2', 'module2_field1', 'state'], REQUEST_STATUS.PENDING)
    .setIn(['module1', 'module2_field1', 'expirationStatus'], EXPIRATION_STATUS.REFRESHING)

  const isRefreshing = selectIsRefreshing(dummyStore)
  expect(isRefreshing).toBe(true)
})

it('isRefreshing should be false when data is expired and not refreshing', () => {
  let dummyStore = Map({
    module1: Module1(),
    module2: Module2(),
  })
  dummyStore = dummyStore
    .setIn(['module1', 'module1_field1', 'state'], REQUEST_STATUS.SUCCESS)
    .setIn(['module1', 'module1_field1', 'expirationStatus'], EXPIRATION_STATUS.EXPIRED)
    .setIn(['module1', 'module1_field2', 'state'], REQUEST_STATUS.SUCCESS)
    .setIn(['module1', 'module1_field2', 'expirationStatus'], EXPIRATION_STATUS.EXPIRED)
    .setIn(['module2', 'module2_field1', 'state'], REQUEST_STATUS.SUCCESS)
    .setIn(['module1', 'module2_field1', 'expirationStatus'], EXPIRATION_STATUS.NOT_EXPIRED)

  const isRefreshing = selectIsRefreshing(dummyStore)
  expect(isRefreshing).toBe(false)
})
