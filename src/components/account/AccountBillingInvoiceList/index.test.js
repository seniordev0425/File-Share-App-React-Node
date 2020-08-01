import React from 'react'
import { mount } from 'enzyme'
import { List } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { ListData } from 'store/common/models'
import Spinner from 'components/common/Spinner'
import { AccountBillingInvoiceList } from './index'


const props = {
  invoiceList: ListData(),
  loadInvoiceList: e => e,
}

it('renders loading state', () => {
  const wrapper = mount(<AccountBillingInvoiceList {...props} />)

  expect(wrapper.find(Spinner).length).toEqual(1)
})

it('renders failed state', () => {
  const localProps = {
    ...props,
    invoiceList: ListData({
      state: REQUEST_STATUS.FAIL,
    }),
  }
  const wrapper = mount(<AccountBillingInvoiceList {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(1)
})

it('renders state with loaded data', () => {
  const localProps = {
    ...props,
    invoiceList: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: List(),
    }),
  }
  const wrapper = mount(<AccountBillingInvoiceList {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(0)
  expect(wrapper.find('table').length).not.toEqual(0)
})
