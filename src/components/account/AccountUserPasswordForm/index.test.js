import React from 'react'
import { mount } from 'enzyme'

import { changeInputValue } from 'utils/testTools'
import AccountUserPasswordForm from './index'


it('renders the form', () => {
  const props = {
    onSubmit: e => e,
  }

  const wrapper = mount(<AccountUserPasswordForm {...props} />)

  expect(wrapper.find('form').length).toEqual(1)
})

it('submits data from valid values', async () => {
  const localProps = {
    onSubmit: jest.fn(),
  }

  const wrapper = mount(<AccountUserPasswordForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'password',
  }).find('input'), 'abcde123')
  changeInputValue(wrapper.find({
    name: 'password_confirm',
  }).find('input'), 'abcde123')

  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    password: 'abcde123',
  })
})

it('should not submit data from invalid values', async () => {
  const localProps = {
    onSubmit: jest.fn(),
  }

  const wrapper = mount(<AccountUserPasswordForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'password',
  }).find('input'), 'abcde123')
  changeInputValue(wrapper.find({
    name: 'password_confirm',
  }).find('input'), 'abcde132')

  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).not.toHaveBeenCalled()
})
