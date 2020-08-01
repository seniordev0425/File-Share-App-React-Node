import React from 'react'
import { mount } from 'enzyme'

import { changeInputValue, timeoutPromise } from 'utils/testTools'
import TwoFactorCodeForm from './index'


const props = {
  submitting: false,
  onSubmit: e => e,
}

it('renders the form', () => {
  const wrapper = mount(<TwoFactorCodeForm {...props} />)

  expect(wrapper.find('form').length).not.toEqual(0)
})

it('submits entered code', () => {
  const code = '110650'
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }

  const wrapper = mount(<TwoFactorCodeForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'code'
  }).find('input'), code)

  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    code,
  })
})
