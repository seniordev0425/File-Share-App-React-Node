import React from 'react'
import { mount } from 'enzyme'

import { user } from 'test/fixtures/user'
import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { changeInputValue } from 'utils/testTools'
import { TWOFACTOR_MODE } from '../constants'
import { CodeFromSMS } from './index'


const props = {
  onSubmit: e => e,
  setTwoFactorMode: e => e,
  user: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: user,
  }),
  sendCodeState: REQUEST_STATUS.INITIAL,
  resetSendTwoFactorCode: e => e,
  sendTwoFactorCodeBySMS: e => e,
}

it('submits entered value', () => {
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
    sendTwoFactorCodeBySMS: jest.fn()
  }
  const wrapper = mount(<CodeFromSMS {...localProps} />)

  expect(localProps.sendTwoFactorCodeBySMS).toHaveBeenCalled()
  changeInputValue(wrapper.find('input'), '156789')
  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    code: '156789',
  })
})

it('sets 2fa mode to authy when approprite button clicked', () => {
  const localProps = {
    ...props,
    setTwoFactorMode: jest.fn(),
  }
  const wrapper = mount(<CodeFromSMS {...localProps} />)

  wrapper.find('button').at(2).simulate('click')

  expect(localProps.setTwoFactorMode).toHaveBeenCalledWith(TWOFACTOR_MODE.AUTHY)
})

it('sets 2fa mode to all when approprite button clicked', () => {
  const localProps = {
    ...props,
    setTwoFactorMode: jest.fn(),
  }
  const wrapper = mount(<CodeFromSMS {...localProps} />)

  wrapper.find('button').at(3).simulate('click')

  expect(localProps.setTwoFactorMode).toHaveBeenCalledWith(TWOFACTOR_MODE.CALL)
})
