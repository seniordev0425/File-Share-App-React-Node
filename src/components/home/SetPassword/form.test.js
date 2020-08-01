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
  }).find('input'), 'passwordfornewaccount')

  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    password: 'passwordfornewaccount',
  })
})
