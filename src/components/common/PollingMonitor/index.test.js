import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { Map } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { PollingResultType, moduleMap } from 'store/persist'
import { PollResult } from 'store/modules/poll'
import { PollingMonitor } from './index'


const props = {
  store: Map(),
  isRefreshing: false,
  pollResult: DetailData({
    data: PollResult(),
  }),
  poll: e => e,
  expirePersistedData: e => e,
}

jest.useFakeTimers()

it('should run initial poll', () => {
  const localProps = {
    ...props,
    poll: jest.fn(),
  }
  mount(<PollingMonitor {...localProps} />)

  jest.runOnlyPendingTimers()
  expect(localProps.poll).toHaveBeenCalled()
})

it('should run poll when last call finishes', () => {
  const localProps = {
    ...props,
    poll: jest.fn(),
  }
  const wrapper = mount(<PollingMonitor {...localProps} />)

  jest.runOnlyPendingTimers()
  expect(localProps.poll).toHaveBeenCalledWith({
    wait: 0,
    lastactivity: '',
    onSuccess: expect.anything(),
  })

  localProps.poll.mockReset()
  wrapper.setProps({
    ...localProps,
    pollResult: DetailData({
      state: REQUEST_STATUS.PENDING,
      data: PollResult(),
    }),
  })
  wrapper.setProps({
    ...localProps,
    pollResult: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: PollResult({
        activity: Map({
          analytics: '2018-11-01 20:14:14.000 UTC',
          cdns: '2018-11-01 20:14:14.000 UTC',
          user: '2018-11-05 20:14:14.000 UTC',
          'analytic:config=profile1': '2018-11-02 10:00:00.000 UTC',
          'server:changes=server1': '2018-11-02 10:00:00.000 UTC',
        }),
      }),
    }),
  })
  jest.runOnlyPendingTimers()
  expect(localProps.poll).toHaveBeenCalledWith({
    lastactivity: '2018-11-05 20:14:14.000 UTC',
    wait: 55,
    onSuccess: expect.anything(),
    updated: true,
  })
})

it('should dispatch expiration action when poll result has updates', () => {
  const localProps = {
    ...props,
    poll: jest.fn(),
    expirePersistedData: jest.fn(),
  }
  mount(<PollingMonitor {...localProps} />)

  jest.runOnlyPendingTimers()
  expect(localProps.poll).toHaveBeenCalled()
  localProps.poll.mock.calls[0][0].onSuccess({
    activity: {
      analytics: '2018-11-01 20:14:14.000 UTC',
      cdns: '2018-11-01 20:14:14.000 UTC',
      user: '2018-11-05 20:14:14.000 UTC',
      'analytic:config=profile1': '2018-11-02 10:00:00.000 UTC',
      'server:changes=server1': '2018-11-02 10:00:00.000 UTC',
    }
  }, {
    lastactivity: '2018-11-03 22:37:25.000 UTC',
    updated: true,
  })

  jest.runOnlyPendingTimers()
  expect(localProps.expirePersistedData).toHaveBeenCalled()
  const expectedExpiredModules = [].concat(
    moduleMap[PollingResultType.cdns],
    moduleMap[PollingResultType.analytics],
    moduleMap[PollingResultType.user],
    moduleMap[PollingResultType.analyticConfig],
    moduleMap[PollingResultType.serverChanges],
  )
  expect(localProps.expirePersistedData.mock.calls[0][0].sort()).toEqual(expectedExpiredModules.sort())
})

it('should not dispatch expiration action when poll result has no activity updates', () => {
  const localProps = {
    ...props,
    poll: jest.fn(),
    expirePersistedData: jest.fn(),
  }
  mount(<PollingMonitor {...localProps} />)

  jest.runOnlyPendingTimers()
  expect(localProps.poll).toHaveBeenCalled()
  localProps.poll.mock.calls[0][0].onSuccess({
    activity: null
  }, {
    lastactivity: '2018-11-03 22:37:25.000 UTC',
  })

  jest.runOnlyPendingTimers()
  expect(localProps.expirePersistedData).not.toHaveBeenCalled()
})

it('should run poll when browser becomes online', () => {
  const map = {};
  window.addEventListener = jest.fn((event, cb) => {
    map[event] = cb
  })

  const localProps = {
    ...props,
    poll: jest.fn(),
  }
  mount(<PollingMonitor {...localProps} />)

  jest.runOnlyPendingTimers()
  localProps.poll.mockReset()
  expect(localProps.poll).not.toHaveBeenCalled()

  act(() => {
    map.online()
  })

  expect(localProps.poll).toHaveBeenCalled()
})

it('should run poll when page becomes visible', () => {
  const map = {};
  document.addEventListener = jest.fn((event, cb) => {
    map[event] = cb
  })

  const localProps = {
    ...props,
    poll: jest.fn(),
  }
  mount(<PollingMonitor {...localProps} />)

  jest.runOnlyPendingTimers()
  localProps.poll.mockReset()
  expect(localProps.poll).not.toHaveBeenCalled()

  act(() => {
    map.visibilitychange()
  })

  expect(localProps.poll).toHaveBeenCalled()
})
