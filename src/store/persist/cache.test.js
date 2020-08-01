import { Map, Record } from 'immutable'

import { REQUEST_STATUS, EXPIRATION_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { EXPIRE_PERSISTED_DATA } from './constants'
import { createPersistenceHandlers } from './cache'


const DataType1 = Record({
  id: 0,
  name: '',
})

const DataType2 = Record({
  id: 0,
  value: '',
})

const State = Record({
  field1: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: DataType1({
      id: 1,
      name: 'User1',
    }),
  }),
  field2: DetailData({
    state: REQUEST_STATUS.PENDING,
    data: DataType1({
      id: 2,
      name: 'User2',
    }),
  }),
  field3Map: Map({
    key1: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: DataType1({
        id: 11,
        name: 'Value1',
      }),
    }),
    key2: DetailData({
      state: REQUEST_STATUS.PENDING,
      data: DataType1({
        id: 12,
        name: 'Value2',
      }),
    }),
  }),
})

const moduleName = 'module1'

const persistedHandlers = createPersistenceHandlers(moduleName)

it('should set fields to expired state correctly', () => {
  const initialModuleState = State()
  const nextModuleState = persistedHandlers[EXPIRE_PERSISTED_DATA](
    initialModuleState,
    {
      payload: [moduleName],
    }
  )

  expect(nextModuleState.getIn(['field1', 'expirationStatus'])).toEqual(EXPIRATION_STATUS.EXPIRED)
  expect(nextModuleState.getIn(['field2', 'expirationStatus'])).toEqual(EXPIRATION_STATUS.NOT_EXPIRED)
  expect(
    nextModuleState.getIn(['field3Map', 'key1', 'expirationStatus'])
  ).toEqual(EXPIRATION_STATUS.EXPIRED)
  expect(
    nextModuleState.getIn(['field3Map', 'key2', 'expirationStatus'])
  ).toEqual(EXPIRATION_STATUS.NOT_EXPIRED)
})

it('should set fields to expired state correctly for extended activities', () => {
  const initialModuleState = State()
  const nextModuleState = persistedHandlers[EXPIRE_PERSISTED_DATA](
    initialModuleState,
    {
      payload: [`${moduleName}:field1`],
    }
  )

  expect(nextModuleState.getIn(['field1', 'expirationStatus'])).toEqual(EXPIRATION_STATUS.EXPIRED)
  expect(nextModuleState.getIn(['field2', 'expirationStatus'])).toEqual(EXPIRATION_STATUS.NOT_EXPIRED)
  expect(
    nextModuleState.getIn(['field3Map', 'key1', 'expirationStatus'])
  ).toEqual(EXPIRATION_STATUS.NOT_EXPIRED)
  expect(
    nextModuleState.getIn(['field3Map', 'key2', 'expirationStatus'])
  ).toEqual(EXPIRATION_STATUS.NOT_EXPIRED)
})

it('should set map fields to expired state correctly for extended activities', () => {
  const initialModuleState = State()
  const nextModuleState = persistedHandlers[EXPIRE_PERSISTED_DATA](
    initialModuleState,
    {
      payload: [`${moduleName}:field3Map`],
    }
  )

  expect(nextModuleState.getIn(['field1', 'expirationStatus'])).toEqual(EXPIRATION_STATUS.NOT_EXPIRED)
  expect(nextModuleState.getIn(['field2', 'expirationStatus'])).toEqual(EXPIRATION_STATUS.NOT_EXPIRED)
  expect(
    nextModuleState.getIn(['field3Map', 'key1', 'expirationStatus'])
  ).toEqual(EXPIRATION_STATUS.EXPIRED)
  expect(
    nextModuleState.getIn(['field3Map', 'key2', 'expirationStatus'])
  ).toEqual(EXPIRATION_STATUS.NOT_EXPIRED)
})
