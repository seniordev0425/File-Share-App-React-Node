import React from 'react'
import { mount } from 'enzyme'
import { Button } from 'reactstrap'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { Plan, Subscription } from 'store/modules/billing'
import { AccountBillingCurrentPlanInfo } from './index'


const props = {
  planData: Plan(),
  subscriptionData: Subscription(),
  onUpdateSubscription: e => e,
  onCancelSubscription: e => e,
}

describe('AccountBillingCurrentPlanInfo', () => {
  it('renders loaded state when subscription is free-tier', () => {
    const localProps = {
      ...props,
      planData: Plan({
        name: 'freetier'
      }),
    }
    const wrapper = mount(<AccountBillingCurrentPlanInfo {...localProps} />)
  
    expect(wrapper.find(Button).at(0).text()).toEqual('Add Subscription')
  })
  
  it('renders loaded state when subscription is premium-tier', () => {
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
    const wrapper = mount(<AccountBillingCurrentPlanInfo {...localProps} />)
  
    expect(wrapper.find(Button).at(0).text()).toEqual('Upgrade to Business')
    expect(wrapper.find(Button).at(1).text()).toEqual('Cancel Subscription')
  })
})
