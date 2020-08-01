import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { Redirect } from 'react-router-dom'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { OAuthResult } from 'store/modules/storage'
import { PasswordCodeData } from 'store/modules/user'
import Spinner from 'components/common/Spinner'
import { SetPassword } from './index'
import PasswordForm from './form'


jest.mock('react-router-dom', () => ({
  __esModule: true,
  Redirect: () => null,
}))

const props = {
  oauthResult: DetailData(),
  passwordCodeData: DetailData(),
  setPasswordState: REQUEST_STATUS.INITIAL,
  checkPasswordCode: e => e,
  setPassword: e => e,
}

const data = {
  oauthResult: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: OAuthResult({
      provider: 'googledrive',
      email: 'tester@fast.io',
      password: '150670',
    }),
  }),
  passwordCodeData: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: PasswordCodeData({
      email: 'tester@fast.io',
    }),
  })
}

it('redirects to login if oauth result not loaded', () => {
  const wrapper = mount(<SetPassword {...props} />)

  expect(wrapper.find(Redirect).length).not.toEqual(0)
  expect(wrapper.find(Redirect).prop('to')).toEqual('/login')
})

it('renders state for checking password code', () => {
  const localProps = {
    ...props,
    oauthResult: data.oauthResult,
    checkPasswordCode: jest.fn(),
  }
  const wrapper = mount(<SetPassword {...localProps} />)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
  expect(localProps.checkPasswordCode).toHaveBeenCalledWith({
    code: localProps.oauthResult.data.password,
  })
})

it('requests to set password when password code checked and new password entered', () => {
  const localProps = {
    ...props,
    ...data,
    setPassword: jest.fn(),
  }
  const wrapper = mount(<SetPassword {...localProps} />)

  expect(wrapper.find(PasswordForm).length).not.toEqual(0)

  act(() => wrapper.find(PasswordForm).prop('onSubmit')({
    password: 'mypassword'
  }))

  expect(localProps.setPassword).toHaveBeenCalledWith({
    code: localProps.oauthResult.data.password,
    data: {
      password1: 'mypassword',
      password2: 'mypassword',
    }
  })
})
