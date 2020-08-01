import React from 'react'
import { mount } from 'enzyme'

import { changeInputValue } from 'utils/testTools'
import { TWOFACTOR_MODE } from '../constants'
import CodeFromAuthy from './index'


const props = {
  onSubmit: e => e,
  setTwoFactorMode: e => e,
}

it('submits entered value', () => {
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<CodeFromAuthy {...localProps} />)

  changeInputValue(wrapper.find('input'), '156789')
  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    code: '156789',
  })
})

it('sets 2fa mode to sms when approprite button clicked', () => {
  const localProps = {
    ...props,
    setTwoFactorMode: jest.fn(),
  }
  const wrapper = mount(<CodeFromAuthy {...localProps} />)

  wrapper.find('button').at(1).simulate('click')

  expect(localProps.setTwoFactorMode).toHaveBeenCalledWith(TWOFACTOR_MODE.SMS)
})

it('sets 2fa mode to call when approprite button clicked', () => {
  const localProps = {
    ...props,
    setTwoFactorMode: jest.fn(),
  }
  const wrapper = mount(<CodeFromAuthy {...localProps} />)

  wrapper.find('button').at(2).simulate('click')

  expect(localProps.setTwoFactorMode).toHaveBeenCalledWith(TWOFACTOR_MODE.CALL)
})
