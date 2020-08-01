import { List, Map, Record } from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { REQUEST_STATUS } from 'constants/common'
import {
  PaginatedListData,
  DetailData,
} from 'store/common/models'

import {
  requestSuccess,
  requestFail,
  setPageAction,
  setPageSizeAction,
  convertToListRecord,
  getErrorResponseFromPayload,
  requestLoopHandlersForGet,
  requestLoopHandlersForUpdate,
  requestLoopHandlersForGetDetailMap,
} from './state'


const DummyRecord = Record({
  id: 0,
  name: '',
  description: '',
  mdm_type: 'dummy_record',
})

const DummyRecordData = DetailData

const State = Record({
  dummyRecord: DummyRecordData(),
  dummyRecordList: PaginatedListData(),
  dummyDetailMap: Map(),
  updateDummyRecordState: REQUEST_STATUS.INITIAL,
})

const initialState = State()

const TEST_ACTION = 'adept_edge/test/action'

const testAction = createAction(TEST_ACTION)
const testActionSuccess = createAction(requestSuccess(TEST_ACTION))
const testActionFail = createAction(requestFail(TEST_ACTION))
const testActionSetPage = createAction(setPageAction(TEST_ACTION))
const testActionSetPageSize = createAction(setPageSizeAction(TEST_ACTION))

const notFoundError = new Error('Not found error')
notFoundError.response = { status: 404 }


describe('State model', () => {
  it('should have correct initial state', () => {
    const state = State()
    expect(state.dummyRecord.state).toEqual(REQUEST_STATUS.INITIAL)
    expect(state.dummyRecordList.state).toEqual(REQUEST_STATUS.INITIAL)
    expect(state.dummyRecordList.data.size).toEqual(0)
  })
})

describe('getErrorResponseFromPayload', () => {
  it('should get payload.response', () => {
    const payload = {
      response: { result: false }
    }
    expect(getErrorResponseFromPayload(payload)).toEqual(payload.response)
  })

  it('should get payload.error.response', () => {
    const payload = {
      error: {
        response: {
          result: false,
          status: 500,
        }
      }
    }
    expect(getErrorResponseFromPayload(payload)).toEqual(payload.error.response)
  })

  it('should fallback to default error response when payload doesn\'t have response and error', () => {
    expect(getErrorResponseFromPayload({})).toEqual({
      status: 400
    })
  })

  it('should fallback to default error response when payload is null', () => {
    expect(getErrorResponseFromPayload(null)).toEqual({
      status: 400
    })
  })
})

describe('requestLoopHandlersForGet', () => {

  /* Test for get detail data handlers */

  it('should set correct pending state for detail data', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForGet({
      action: TEST_ACTION,
      dataField: 'dummyRecord',
      getDataFromPayload: payload => DummyRecord(payload),
    }), initialState)

    state = reducer(state, testAction({ id: 10 }))

    expect(state.dummyRecord.state).toEqual(REQUEST_STATUS.PENDING)

    // requestLoopHandlersForGet has initialValues field, and it's null when omitted
    expect(state.dummyRecord.data).toBeNull()
  })

  it('should set correct success state for detail data', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForGet({
      action: TEST_ACTION,
      dataField: 'dummyRecord',
      getDataFromPayload: payload => DummyRecord(payload),
    }), initialState)

    const dummyRecordPayload = {
      id: 10,
      name: 'Dummy data',
      description: 'Description for dummy data'
    }

    state = reducer(state, testActionSuccess(dummyRecordPayload))

    expect(state.dummyRecord.state).toEqual(REQUEST_STATUS.SUCCESS)
    expect(state.dummyRecord.data.id).toEqual(dummyRecordPayload.id)
    expect(state.dummyRecord.data.name).toEqual(dummyRecordPayload.name)
    expect(state.dummyRecord.data.description).toEqual(dummyRecordPayload.description)
    expect(state.dummyRecord.data.mdm_type).toEqual('dummy_record')
  })

  it('should set correct failure state for detail data', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForGet({
      action: TEST_ACTION,
      dataField: 'dummyRecord',
      getDataFromPayload: payload => DummyRecord(payload),
    }), initialState)

    state = reducer(state, testActionFail(notFoundError))

    expect(state.dummyRecord.state).toEqual(REQUEST_STATUS.FAIL)

    // requestLoopHandlersForGet has initialValues field, and it's null when omitted
    expect(state.dummyRecord.data).toBeNull()
  })

  /* Test for get list data handlers */

  it('should set correct pending state for list data', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForGet({
      action: TEST_ACTION,
      dataField: 'dummyRecordList',
      initialValue: List(),
      getDataFromPayload: payload => convertToListRecord(payload, DummyRecord),
    }), initialState)

    state = reducer(state, testAction())

    expect(state.dummyRecordList.state).toEqual(REQUEST_STATUS.PENDING)
    expect(state.dummyRecordList.data.size).toEqual(0)
  })

  it('should set correct success state for list data', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForGet({
      action: TEST_ACTION,
      dataField: 'dummyRecordList',
      initialValue: List(),
      getDataFromPayload: payload => convertToListRecord(payload, DummyRecord),
    }), initialState)

    const dummyRecordListPayload = [{
      id: 10,
      name: 'Dummy data',
      description: 'Description for dummy data'
    }, {
      id: 11,
      name: 'Another dummy data',
      description: 'Here comes another dummy data'
    }]

    state = reducer(state, testActionSuccess(dummyRecordListPayload))

    expect(state.dummyRecordList.state).toEqual(REQUEST_STATUS.SUCCESS)
    expect(state.dummyRecordList.data.size).toEqual(dummyRecordListPayload.length)
    for (let i = 0; i < dummyRecordListPayload.length; i += 1) {
      expect(state.dummyRecordList.data.get(i).id).toEqual(dummyRecordListPayload[i].id)
      expect(state.dummyRecordList.data.get(i).name).toEqual(dummyRecordListPayload[i].name)
      expect(state.dummyRecordList.data.get(i).description).toEqual(dummyRecordListPayload[i].description)
      expect(state.dummyRecordList.data.get(i).mdm_type).toEqual('dummy_record')
    }
  })

  it('should set correct failure state for list data', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForGet({
      action: TEST_ACTION,
      dataField: 'dummyRecordList',
      initialValue: List(),
      getDataFromPayload: payload => convertToListRecord(payload, DummyRecord),
    }), initialState)

    state = reducer(state, testActionFail(notFoundError))

    expect(state.dummyRecordList.state).toEqual(REQUEST_STATUS.FAIL)
    expect(state.dummyRecordList.data.size).toEqual(0)
  })

  /* Test for paginated list api */

  it('should set correct success state for paginated list data', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForGet({
      action: TEST_ACTION,
      dataField: 'dummyRecordList',
      initialValue: List(),
      getDataFromPayload: payload => convertToListRecord(payload.results, DummyRecord),
      usePagination: true,
    }), initialState)

    const dummyRecordListPayload = {
      results: [{
        id: 10,
        name: 'Dummy data',
        description: 'Description for dummy data'
      }, {
        id: 11,
        name: 'Another dummy data',
        description: 'Here comes another dummy data'
      }],
      count: 10,
    }

    state = reducer(state, testActionSuccess(dummyRecordListPayload))

    expect(state.dummyRecordList.state).toEqual(REQUEST_STATUS.SUCCESS)
    expect(state.dummyRecordList.data.size).toEqual(dummyRecordListPayload.results.length)
    expect(state.dummyRecordList.count).toEqual(10)
    for (let i = 0; i < dummyRecordListPayload.length; i += 1) {
      expect(state.dummyRecordList.data.get(i).id).toEqual(dummyRecordListPayload[i].id)
      expect(state.dummyRecordList.data.get(i).name).toEqual(dummyRecordListPayload[i].name)
      expect(state.dummyRecordList.data.get(i).description).toEqual(dummyRecordListPayload[i].description)
      expect(state.dummyRecordList.data.get(i).mdm_type).toEqual('dummy_record')
    }
  })

  it('should set page for paginated list data', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForGet({
      action: TEST_ACTION,
      dataField: 'dummyRecordList',
      initialValue: List(),
      getDataFromPayload: payload => convertToListRecord(payload.results, DummyRecord),
      usePagination: true,
    }), initialState)

    state = reducer(state, testActionSetPage(5))

    expect(state.dummyRecordList.page).toEqual(5)
  })

  it('should set page size for paginated list data', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForGet({
      action: TEST_ACTION,
      dataField: 'dummyRecordList',
      initialValue: List(),
      getDataFromPayload: payload => convertToListRecord(payload.results, DummyRecord),
      usePagination: true,
    }), initialState)

    state = reducer(state, testActionSetPageSize(20))

    expect(state.dummyRecordList.pageSize).toEqual(20)
  })
})

describe('requestLoopHandlersForUpdate', () => {

  /* Test for create/update/delete api handlers */

  it('should set correct pending state for data submit action', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForUpdate({
      action: TEST_ACTION,
      stateField: 'updateDummyRecordState',
    }), initialState)

    state = reducer(state, testAction())

    expect(state.updateDummyRecordState).toEqual(REQUEST_STATUS.PENDING)
  })

  it('should set correct success state for data submit action', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForUpdate({
      action: TEST_ACTION,
      stateField: 'updateDummyRecordState',
    }), initialState)

    state = reducer(state, testActionSuccess())

    expect(state.updateDummyRecordState).toEqual(REQUEST_STATUS.SUCCESS)
  })

  it('should set correct failure state for data submit action', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForUpdate({
      action: TEST_ACTION,
      stateField: 'updateDummyRecordState',
    }), initialState)

    state = reducer(state, testActionFail(notFoundError))

    expect(state.updateDummyRecordState).toEqual(REQUEST_STATUS.FAIL)
  })
})

describe('requestLoopHandlersForGetDetailMap', () => {

  /* Test for get detail data handlers */

  it('should set correct pending state for detail data', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForGetDetailMap({
      action: TEST_ACTION,
      mapField: 'dummyDetailMap',
      getDataFromPayload: payload => DummyRecord(payload),
    }), initialState)

    state = reducer(state, testAction({ id: 10 }))

    expect(state.dummyDetailMap.get(10).state).toEqual(REQUEST_STATUS.PENDING)

    // requestLoopHandlersForGetDetailMap has initialValues field, and it's null when omitted
    expect(state.dummyDetailMap.get(10).data).toBeNull()
  })

  it('should set correct success state for detail data', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForGetDetailMap({
      action: TEST_ACTION,
      mapField: 'dummyDetailMap',
      getDataFromPayload: payload => DummyRecord(payload),
    }), initialState)

    const dummyDetailMapPayload = {
      id: 10,
      name: 'Dummy data',
      description: 'Description for dummy data'
    }

    state = reducer(state, testAction({ id: 10 }))

    state = reducer(state, testActionSuccess(dummyDetailMapPayload))

    expect(state.dummyDetailMap.get(10).state).toEqual(REQUEST_STATUS.SUCCESS)
    expect(state.dummyDetailMap.get(10).data.id).toEqual(dummyDetailMapPayload.id)
    expect(state.dummyDetailMap.get(10).data.name).toEqual(dummyDetailMapPayload.name)
    expect(state.dummyDetailMap.get(10).data.description).toEqual(dummyDetailMapPayload.description)
  })

  it('should set correct failure state for detail data', () => {
    let state = State()

    const reducer = handleActions(requestLoopHandlersForGetDetailMap({
      action: TEST_ACTION,
      mapField: 'dummyDetailMap',
      getDataFromPayload: payload => DummyRecord(payload),
    }), initialState)

    state = reducer(state, testAction({ id: 10 }))

    notFoundError.id = 10
    state = reducer(state, testActionFail(notFoundError))

    expect(state.dummyDetailMap.get(10).state).toEqual(REQUEST_STATUS.FAIL)

    // requestLoopHandlersForGetDetailMap has initialValues field, and it's null when omitted
    expect(state.dummyDetailMap.get(10).data).toBeNull()
  })

  it('should process 2 different loops', () => {
    const data = [
      {
        id: 10,
        name: 'Dummy data',
        description: 'Description for dummy data'
      },
      {
        id: 11,
        name: 'Another Dummy data',
        description: 'Description for another dummy data'
      },
    ]

    let state = State()

    const reducer = handleActions(requestLoopHandlersForGetDetailMap({
      action: TEST_ACTION,
      mapField: 'dummyDetailMap',
      getDataFromPayload: payload => DummyRecord(payload),
    }), initialState)

    state = reducer(state, testAction({ id: 10 }))

    expect(state.dummyDetailMap.get(10).state).toEqual(REQUEST_STATUS.PENDING)

    state = reducer(state, testAction({ id: 11 }))

    expect(state.dummyDetailMap.get(11).state).toEqual(REQUEST_STATUS.PENDING)

    // id=11 load success

    state = reducer(state, testActionSuccess({
      id: 11,
      ...data[1],
    }))

    expect(state.dummyDetailMap.get(10).state).toEqual(REQUEST_STATUS.PENDING)
    expect(state.dummyDetailMap.get(11).state).toEqual(REQUEST_STATUS.SUCCESS)
    expect(state.dummyDetailMap.get(11).data.id).toEqual(data[1].id)
    expect(state.dummyDetailMap.get(11).data.name).toEqual(data[1].name)
    expect(state.dummyDetailMap.get(11).data.description).toEqual(data[1].description)

    // id=10 load fail

    notFoundError.id = 10
    state = reducer(state, testActionFail(notFoundError))

    expect(state.dummyDetailMap.get(10).state).toEqual(REQUEST_STATUS.FAIL)
    expect(state.dummyDetailMap.get(11).state).toEqual(REQUEST_STATUS.SUCCESS)
    expect(state.dummyDetailMap.get(11).data.id).toEqual(data[1].id)
    expect(state.dummyDetailMap.get(11).data.name).toEqual(data[1].name)
    expect(state.dummyDetailMap.get(11).data.description).toEqual(data[1].description)
  })
})
