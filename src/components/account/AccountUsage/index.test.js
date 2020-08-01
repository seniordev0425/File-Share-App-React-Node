import React from 'react'
import { mount } from 'enzyme'
import { List } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { AccountStats, AccountStatsRecord } from 'store/modules/accountStats'
import { Plan, Subscription } from 'store/modules/billing'
import Spinner from 'components/common/Spinner'
import { AccountUsage } from './index'


jest.mock('components/common/StatsChart', () => () => <span />)
jest.mock('components/common/UsageDateRangePicker', () => () => <span />)

const props = {
  accountStats: DetailData(),
  recentAccountStats: DetailData(),
  plan: DetailData(),
  subscription: DetailData(),
  loadAccountStats: e => e,
  loadRecentAccountStats: e => e,
  loadPlan: e => e,
  loadSubscription: e => e,
}

const data = {
  accountStats: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: AccountStats({
      transfers: List([
        AccountStatsRecord({
          transfers: 3,
          bytes: 150,
          start: '2019-03-09 13:00:00 UTC',
          end: '2019-03-10 12:59:59 UTC',
        }),
        AccountStatsRecord({
          transfers: 2,
          bytes: 200,
          start: '2019-03-08 13:00:00 UTC',
          end: '2019-03-09 12:59:59 UTC',
        }),
      ]),
    }),
  }),
  plan: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: Plan({
      name: 'TestPlan',
      desc: 'Plan for testing',
      price_base: 7,
      price_meter: 0.5,
      unit: 1024 * 1024 * 1024,
      available: true,
    })
  }),
  subscription: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: Subscription({
      currency: 'usd',
    })
  }),
}

it('renders loading state', () => {
  const localProps = {
    ...props,
    loadAccountStats: jest.fn(),
    loadRecentAccountStats: jest.fn(),
    loadPlan: jest.fn(),
    loadSubscription: jest.fn(),
  }
  const wrapper = mount(<AccountUsage {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(2)
  expect(localProps.loadAccountStats).toHaveBeenCalled()
  expect(localProps.loadRecentAccountStats).toHaveBeenCalled()
  expect(localProps.loadPlan).toHaveBeenCalled()
  expect(localProps.loadSubscription).toHaveBeenCalled()
})

it('renders state of usage log loaded but plan or subscription not loaded yet', () => {
  const localProps = {
    ...props,
    accountStats: data.accountStats,
    loadAccountStats: jest.fn(),
    loadPlan: jest.fn(),
    loadSubscription: jest.fn(),
  }
  const wrapper = mount(<AccountUsage {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(2)
  expect(localProps.loadPlan).toHaveBeenCalled()
  expect(localProps.loadSubscription).toHaveBeenCalled()
})

it('renders total section when plan is free', () => {
  const localProps = {
    ...props,
    ...data,
    subscription: DetailData({
      state: REQUEST_STATUS.FAIL,
    }),
    loadAccountStats: jest.fn(),
    loadPlan: jest.fn(),
    loadSubscription: jest.fn(),
  }
  const wrapper = mount(<AccountUsage {...localProps} />)

  expect(wrapper.find('div.Usage-totalsColumn').length).toEqual(1)
  expect(wrapper.find('div.Usage-totalsColumn h3').at(0).text()).toEqual('Transfers')
  expect(wrapper.find('div.Usage-totalsColumn h3').at(1).text()).toEqual('Bytes')
  expect(wrapper.find('div.Usage-totalsColumn h3').at(2).text()).toEqual('Costs')
})

it('renders all loaded state', () => {
  const localProps = {
    ...props,
    ...data,
    loadAccountStats: jest.fn(),
    loadPlan: jest.fn(),
    loadSubscription: jest.fn(),
  }
  const wrapper = mount(<AccountUsage {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(0)
  expect(localProps.loadPlan).not.toHaveBeenCalled()
  expect(localProps.loadSubscription).not.toHaveBeenCalled()
})
