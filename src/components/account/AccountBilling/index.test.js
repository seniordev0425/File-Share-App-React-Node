import React from 'react'
import { shallow } from 'enzyme'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { Plan } from 'store/modules/billing'
import Spinner from 'components/common/Spinner'
import { AccountBilling } from './index'


const props = {
  plan: DetailData({
    state: REQUEST_STATUS.INITIAL,
  }),
  loadPlan: e => e,
}

it('renders loading state', () => {
  const wrapper = shallow(<AccountBilling {...props} />)

  expect(wrapper.find(Spinner).length).toEqual(1)
})

it('renders failed state', () => {
  const localProps = {
    ...props,
    plan: DetailData({
      state: REQUEST_STATUS.FAIL,
    }),
  }
  const wrapper = shallow(<AccountBilling {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(1)
})

it('renders state with loaded data', () => {
  const localProps = {
    ...props,
    plan: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: Plan(),
    }),
  }
  const wrapper = shallow(<AccountBilling {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(0)
})
