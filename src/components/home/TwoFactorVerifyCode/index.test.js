import React from 'react'
import { mount } from 'enzyme'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { TwoFactorPayload } from 'store/modules/twofactor'
import Spinner from 'components/common/Spinner'
import { TwoFactorVerifyCode } from './index'


const props = {
  match: { params: { code: '120345' } },
  twoFactorAuth: DetailData(),
  authenticateTwoFactor: e => e,
  authenticateTwoFactorReset: e => e,
  loginFromTwoFactor: e => e,
}

it('renders initial pending state', () => {
  const localProps = {
    ...props,
    authenticateTwoFactor: jest.fn(),
    authenticateTwoFactorReset: jest.fn(),
  }
  const wrapper = mount(<TwoFactorVerifyCode {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(1)
  expect(localProps.authenticateTwoFactor).toHaveBeenCalledWith({
    code: localProps.match.params.code,
  })
  expect(localProps.authenticateTwoFactorReset).toHaveBeenCalled()
})

it('logs in with 2fa-passed token when code verified', () => {
  const localProps = {
    ...props,
    twoFactorAuth: DetailData({
      state: REQUEST_STATUS.PENDING,
    }),
    loginFromTwoFactor: jest.fn(),
  }
  const wrapper = mount(<TwoFactorVerifyCode {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(1)

  const twoFactorPayload = TwoFactorPayload({
    result: true,
    auth_token: '2fa-verified-token-123',
    expires_in: 86400,
  })
  wrapper.setProps({
    ...localProps,
    twoFactorAuth: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: twoFactorPayload,
    })
  })

  expect(localProps.loginFromTwoFactor).toHaveBeenCalledWith(twoFactorPayload)
})

it('shows failure state when code verified', () => {
  const localProps = {
    ...props,
    twoFactorAuth: DetailData({
      state: REQUEST_STATUS.FAIL,
    }),
  }
  const wrapper = mount(<TwoFactorVerifyCode {...localProps} />)

  expect(wrapper.text()).toContain('Invalid 2-factor authentication code')
})
