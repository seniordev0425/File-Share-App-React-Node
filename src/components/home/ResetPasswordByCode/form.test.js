import React from 'react'
import { mount } from 'enzyme'

import { changeInputValue } from 'utils/testTools'
import PasswordForm from './form'


const props = {
  onSubmit: e => e,
}

it('renders initial state', () => {
  const wrapper = mount(<PasswordForm {...props} />)

  expect(wrapper.find('form').length).toEqual(1)
})

it('submits entered password', () => {
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<PasswordForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'password',
  }).find('input'), 'abcde123')
  changeInputValue(wrapper.find({
    name: 'password_confirm',
  }).find('input'), 'abcde123')

  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    password: 'abcde123',
    password_confirm: 'abcde123',
  })
})

it('validation fails when different passwords entered ', () => {
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<PasswordForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'password',
  }).find('input'), 'abcde123')
  changeInputValue(wrapper.find({
    name: 'password_confirm',
  }).find('input'), 'abcde1231')

  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).not.toHaveBeenCalled()
})
