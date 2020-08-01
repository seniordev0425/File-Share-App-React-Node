import React from 'react'
import { mount } from 'enzyme'

import { REQUEST_STATUS } from 'constants/common'
import Spinner from 'components/common/Spinner'
import { TwoFactorSendCode } from '.'


const props = {
  history: { push: e => e },
  match: { params: { method: 'call' } },
  sendCodeState: REQUEST_STATUS.INITIAL,
  resetSendTwoFactorCode: e => e,
  sendTwoFactorCodeByCall: e => e,
  sendTwoFactorCodeBySMS: e => e,
}

it('should send code by call or SMS', () => {
  const verifyCodeSent = method => {
    const localProps = {
      ...props,
      match: { params: { method } },
      resetSendTwoFactorCode: jest.fn(),
      sendTwoFactorCodeByCall: jest.fn(),
      sendTwoFactorCodeBySMS: jest.fn(),
    }
    const wrapper = mount(<TwoFactorSendCode {...localProps} />)

    expect(localProps.resetSendTwoFactorCode).toHaveBeenCalled()
    expect(
      method === 'call' ?
      localProps.sendTwoFactorCodeByCall :
      localProps.sendTwoFactorCodeBySMS
    ).toHaveBeenCalled()
    expect(wrapper.find(Spinner).length).not.toEqual(0)
  }

  verifyCodeSent('call')
  verifyCodeSent('sms')
})

it('should redirect to next step after sending code', () => {
  const verifyRedirectAfterCodeSent = method => {
    const localProps = {
      ...props,
      history: { push: jest.fn() },
      match: { params: { method } },
      sendCodeState: REQUEST_STATUS.PENDING,
    }
    const wrapper = mount(<TwoFactorSendCode {...localProps} />)

    wrapper.setProps({
      ...localProps,
      sendCodeState: REQUEST_STATUS.SUCCESS,
    })

    expect(localProps.history.push).toHaveBeenCalledWith(`/twofactor/verifycode/${method}`)
  }

  verifyRedirectAfterCodeSent('call')
  verifyRedirectAfterCodeSent('sms')
})
