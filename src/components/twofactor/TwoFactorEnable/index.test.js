import React from 'react'
import { mount } from 'enzyme'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { TWOFACTOR_STATE } from 'store/modules/twofactor'
import Spinner from 'components/common/Spinner'
import { TwoFactorEnable } from './index'


const props = {
  history: { push: e => e },
  match: { params: { method: 'call' } },
  twoFactor: DetailData(),
  addTwoFactorState: REQUEST_STATUS.INITIAL,
  resetTwoFactorAddingProcess: e => e,
  getTwoFactor: e => e,
  addTwoFactor: e => e,
}

it('renders initial page', () => {
  const localProps = {
    ...props,
    resetTwoFactorAddingProcess: jest.fn(),
  }
  const wrapper = mount(<TwoFactorEnable {...localProps} />)

  expect(localProps.resetTwoFactorAddingProcess).toHaveBeenCalled()
  expect(wrapper.find(Spinner).length).not.toEqual(0)
})

it('adds 2fa when it is currently disabled', () => {
  const localProps = {
    ...props,
    twoFactor: DetailData({
      state: REQUEST_STATUS.PENDING,
    }),
    addTwoFactor: jest.fn(),
  }
  const wrapper = mount(<TwoFactorEnable {...localProps} />)

  wrapper.setProps({
    ...localProps,
    twoFactor: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: TWOFACTOR_STATE.DISABLED,
    }),
  })

  expect(localProps.addTwoFactor).toHaveBeenCalled()
})

it('skip adding 2fa and goes to next step when 2fa already added', () => {
  const verifyGoingToNextStep = (method, state) => {
    const localProps = {
      ...props,
      history: { push: jest.fn() },
      match: { params: { method, } },
      twoFactor: DetailData({
        state: REQUEST_STATUS.PENDING,
      }),
      addTwoFactor: jest.fn(),
    }
    const wrapper = mount(<TwoFactorEnable {...localProps} />)

    wrapper.setProps({
      ...localProps,
      twoFactor: DetailData({
        state: REQUEST_STATUS.SUCCESS,
        data: state,
      }),
    })

    expect(localProps.addTwoFactor).not.toHaveBeenCalled()
    expect(localProps.history.push).toHaveBeenCalledWith(`/twofactor/sendcode/${method}`)
  }

  verifyGoingToNextStep('call', TWOFACTOR_STATE.UNVERIFIED)
  verifyGoingToNextStep('call', TWOFACTOR_STATE.ENABLED)
  verifyGoingToNextStep('sms', TWOFACTOR_STATE.UNVERIFIED)
  verifyGoingToNextStep('sms', TWOFACTOR_STATE.ENABLED)
})

it('goes to next step after 2fa added', () => {
  const verifyGoingToNextStepAfter2faAdded = (method) => {
    const localProps = {
      ...props,
      history: { push: jest.fn() },
      match: { params: { method, } },
      addTwoFactorState: REQUEST_STATUS.PENDING,
    }
    const wrapper = mount(<TwoFactorEnable {...localProps} />)

    wrapper.setProps({
      ...localProps,
      addTwoFactorState: REQUEST_STATUS.SUCCESS,
    })

    expect(localProps.history.push).toHaveBeenCalledWith(`/twofactor/sendcode/${method}`)
  }

  verifyGoingToNextStepAfter2faAdded('call')
  verifyGoingToNextStepAfter2faAdded('sms')
})
