import React from 'react'
import { mount } from 'enzyme'
import { Button } from 'reactstrap'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { Plan, Subscription } from 'store/modules/billing'
import Spinner from 'components/common/Spinner'
import { AccountBillingSubscription } from './index'
import { AccountBillingCurrentPlanInfo } from '../AccountBillingCurrentPlanInfo'


const props = {
  plan: DetailData(),
  subscription: DetailData(),
  createSubscriptionState: REQUEST_STATUS.INITIAL,
  updateSubscriptionState: REQUEST_STATUS.INITIAL,
  cancelSubscriptionState: REQUEST_STATUS.INITIAL,
  loadSubscription: e => e,
  createSubscription: e => e,
  updateSubscription: e => e,
  cancelSubscription: e => e,
}

jest.mock('../SubscriptionModal')

it('renders loading state', () => {
  const wrapper = mount(<AccountBillingSubscription {...props} />)

  expect(wrapper.find(Spinner).length).toEqual(1)
})

it('renders current plan info', () => {
  const localProps = {
    ...props,
    plan: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: Plan({
        name: '6cPerGBMonthly'
      }),
    }),
    subscription: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: Subscription(),
    })
  }
  const wrapper = mount(<AccountBillingSubscription {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(0)
  expect(wrapper.find(AccountBillingCurrentPlanInfo).length).toBe(1)
})
