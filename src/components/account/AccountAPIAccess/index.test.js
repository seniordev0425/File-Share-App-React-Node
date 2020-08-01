import React from 'react'
import { mount } from 'enzyme'
import { List } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { ListData } from 'store/common/models'
import { APIKey } from 'store/modules/auth'
import Spinner from 'components/common/Spinner'
import { AccountAPIAccess } from './index'



const props = {
  apiKeyList: ListData(),
  createKeyState: REQUEST_STATUS.INITIAL,
  deleteKeyState: REQUEST_STATUS.INITIAL,
  loadKeyList: e => e,
  createKey: e => e,
  deleteKey: e => e,
}

it('renders loading state', () => {
  const localProps = {
    ...props,
    loadKeyList: jest.fn(),
  }
  const wrapper = mount(<AccountAPIAccess {...localProps} />)

  expect(wrapper.find('div').length).not.toEqual(0)
  expect(wrapper.find(Spinner).length).not.toEqual(0)
  expect(localProps.loadKeyList).toHaveBeenCalled()
})

it('displays api keys when loaded', () => {
  const localProps = {
    ...props,
    apiKeyList: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: List([
        APIKey({
          api_key: 'testkey1',
          memo: 'Test key 1',
          created: '2019-04-01 10:00:00 UTC',
        }),
        APIKey({
          api_key: 'testkey2',
          memo: 'Test key 2',
          created: '2019-03-25 05:00:00 UTC',
        }),
      ]),
    })
  }
  const wrapper = mount(<AccountAPIAccess {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(0)
  expect(wrapper.find('table tbody tr').length).toEqual(localProps.apiKeyList.data.size)
  for (let i = 0; i < localProps.apiKeyList.data.size; i += 1) {
    expect(wrapper.find('table tbody tr').at(i).text()).toContain(localProps.apiKeyList.data.get(i).api_key.substr(-4, 4))
  }
})
