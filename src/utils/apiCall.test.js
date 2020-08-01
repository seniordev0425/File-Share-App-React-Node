import axios from 'axios'
import { expectSaga } from 'redux-saga-test-plan'

import { apiCallSaga } from './apiCall'


jest.mock('utils/analytics', () => ({
  trackActivity: jest.fn(),
  reportError: jest.fn(),
}))

describe('apiCallSaga', () => {
  const data = {
    field1: 10,
    field2: 'teststring',
  }

  const config = {
    method: 'post',
    route: '/',
    data,
    successAction: data => ({
      type: 'action_success',
      payload: data,
    }),
    failAction: error => ({
      type: 'action_fail',
      payload: error,
    }),
    beforeSuccessAction: e => e,
    afterSuccessAction: e => e,
    beforeFailAction: e => e,
    afterFailAction: e => e,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call axios method and success callbacks properly on success', () => {
    axios.post = jest.fn(() => Promise.resolve({
      data: {
        ...data,
        result: true,
      },
    }))

    const localConfig = {
      ...config,
      beforeSuccessAction: jest.fn(),
      afterSuccessAction: jest.fn(),
    }
    const sagaFunc = apiCallSaga(localConfig)

    return expectSaga(sagaFunc, {})
      .put({
        type: 'action_success',
        payload: {
          ...data,
          result: true,
          meta: {},
        },
      })
      .run()
      .then(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.anything(),  // api url
          'field1=10&field2=teststring',
          {
            cancelToken: "token123",
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            }
          }
        )
        expect(localConfig.beforeSuccessAction).toHaveBeenCalled()
        expect(localConfig.afterSuccessAction).toHaveBeenCalled()
      })
  })

  it('should call axios method and failure callbacks properly when api result is false', () => {
    const response = {
      data: { result: false }
    }

    axios.post = jest.fn(() => Promise.reject({
      response,
    }))

    const localConfig = {
      ...config,
      beforeFailAction: jest.fn(),
      afterFailAction: jest.fn(),
    }
    const sagaFunc = apiCallSaga(localConfig)

    return expectSaga(sagaFunc, {})
      .put({
        type: 'action_fail',
        payload: {
          response,
        }
      })
      .run()
      .then(() => {
        expect(axios.post).toHaveBeenCalled()
        expect(localConfig.beforeFailAction).toHaveBeenCalled()
        expect(localConfig.afterFailAction).toHaveBeenCalled()
      })
  })

  it('should call axios method and failure callbacks properly when saga threw error', () => {
    const error = new Error('Simulated error')
    error.response = {
      status: 400,
    }
    axios.post = jest.fn(() => Promise.reject(error))

    const localConfig = {
      ...config,
      beforeFailAction: jest.fn(),
      afterFailAction: jest.fn(),
    }
    const sagaFunc = apiCallSaga(localConfig)

    return expectSaga(sagaFunc, {})
      .put({
        type: 'action_fail',
        payload: error,
      })
      .run()
      .then(() => {
        expect(axios.post).toHaveBeenCalled()
        expect(localConfig.beforeFailAction).toHaveBeenCalled()
        expect(localConfig.afterFailAction).toHaveBeenCalled()
      })
  })

  it('should call axios method and success callbacks properly with primary key on success', () => {
    axios.post = jest.fn(() => Promise.resolve({
      data: {
        ...data,
        result: true,
      },
    }))

    const localConfig = {
      ...config,
      idField: 'pkField',
    }
    const sagaFunc = apiCallSaga(localConfig)

    return expectSaga(sagaFunc, {
      type: 'action',
      payload: {
        pkField: 10,
      }
    })
      .put({
        type: 'action_success',
        payload: {
          ...data,
          pkField: 10,
          result: true,
          meta: {},
        },
      })
      .run()
  })

  it('should call axios method and failure callbacks properly with primary key when api result is false', () => {
    const response = {
      data: { result: false }
    }

    axios.post = jest.fn(() => Promise.reject({
      response,
    }))

    const localConfig = {
      ...config,
      idField: 'pkField',
    }
    const sagaFunc = apiCallSaga(localConfig)

    return expectSaga(sagaFunc, {
      type: 'action',
      payload: {
        pkField: 10,
      }
    })
      .put({
        type: 'action_fail',
        payload: {
          pkField: 10,
          response,
        }
      })
      .run()
  })

  it('should call axios method and failure callbacks properly with primary key when saga threw error', () => {
    const error = new Error('Simulated error')
    error.response = {
      status: 400,
    }
    axios.post = jest.fn(() => Promise.reject(error))

    const localConfig = {
      ...config,
      idField: 'pkField',
    }
    const sagaFunc = apiCallSaga(localConfig)

    return expectSaga(sagaFunc, {
      type: 'action',
      payload: {
        pkField: 10,
      }
    })
      .run()
      .then(result => {
        const { effects } = result

        expect(effects.put).toHaveLength(1)

        const { payload } = effects.put[0]
        expect(payload.action).toEqual({
          type: 'action_fail',
          payload: error,
        })
        expect(error.pkField).toEqual(10)
      })
  })
})
