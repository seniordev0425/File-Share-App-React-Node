import React from 'react'
import { mount } from 'enzyme'

import { changeInputValue } from 'utils/testTools'
import TwoFactorCodeForm from './index'


const props = {
  onSubmit: e => e,
  onResend: e => e,
}

it('renders initial form', () => {
  const wrapper = mount(<TwoFactorCodeForm {...props} />)

  expect(wrapper.find('form').length).not.toEqual(0)
})

it('submits entered code', () => {
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<TwoFactorCodeForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'code'
  }).find('input'), '150610')
  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    code: '150610'
  })
})

it('clicking on resend button calls onResend handler', () => {
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
    onResend: jest.fn(),
  }
  const wrapper = mount(<TwoFactorCodeForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'code'
  }).find('input'), '150620')
  wrapper.find('button').at(1).simulate('click')

  expect(localProps.onSubmit).not.toHaveBeenCalled()
  expect(localProps.onResend).toHaveBeenCalled()
})
