import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { REQUEST_STATUS } from 'constants/common'
import { ResetPasswordByCode } from './index'
import PasswordForm from './form'


const props = {
  history: { push: e => e },
  location: { search: '?code=somecode111' },
  setPasswordState: REQUEST_STATUS.INITIAL,
  setPassword: e => e,
  setPasswordReset: e => e,
}

it('renders page and calls action when new password entered', () => {
  const localProps = {
    ...props,
    setPassword: jest.fn(),
    setPasswordReset: jest.fn(),
  }
  const wrapper = mount(<ResetPasswordByCode {...localProps} />)

  expect(wrapper.find(PasswordForm).length).not.toEqual(0)
  expect(localProps.setPasswordReset).toHaveBeenCalled()

  wrapper.find(PasswordForm).prop('onSubmit')({
    password: 'abcde123',
    password_confirm: 'abcde123',
  })

  expect(localProps.setPassword).toHaveBeenCalledWith({
    code: 'somecode111',
    data: {
      password1: 'abcde123',
      password2: 'abcde123',
    },
  })
})
