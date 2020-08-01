import React from 'react'
import { mount } from 'enzyme'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { User } from 'store/modules/user'
import { changeInputValue } from 'utils/testTools'
import { CloseAccount } from './index'


const props = {
  user: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: User({
      id: '1',
      email_address: 'test1@fast.io',
      '2factor': false,
    }),
  }),
  closeAccountState: REQUEST_STATUS.INITIAL,
  closeAccount: e => e,
}

it('renders initial state', () => {
  const wrapper = mount(<CloseAccount {...props} />)

  expect(wrapper.find('button').length).toEqual(1)
})

it('clicking button and entering correct email will invoke closeAccount action', () => {
  const localProps = {
    ...props,
    closeAccount: jest.fn(),
  }
  const wrapper = mount(<CloseAccount {...localProps} />)

  wrapper.find('button').at(0).simulate('click')
  expect(wrapper.find('form').length).toEqual(1)

  changeInputValue(wrapper.find('form').find({
    name: 'email_address',
  }).find('input'), 'test2@fast.io')
  wrapper.find('form').simulate('submit')
  expect(localProps.closeAccount).not.toHaveBeenCalled()

  changeInputValue(wrapper.find('form').find({
    name: 'email_address',
  }).find('input'), 'test1@fast.io')
  wrapper.find('form').simulate('submit')
  expect(localProps.closeAccount).toHaveBeenCalled()
})
