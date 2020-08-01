import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { REQUEST_STATUS } from 'constants/common'
import { changeInputValue } from 'utils/testTools'
import Spinner from 'components/common/Spinner'
import { TwoFactorLoginByPhone } from './index'


const props = {
  history: { push: e => e },
  match: { params: { method: 'sms' } },
  sendCodeState: REQUEST_STATUS.INITIAL,
  sendTwoFactorCodeBySMS: e => e,
  sendTwoFactorCodeByCall: e => e,
}

it('sends code by text when method is specified as sms', () => {
  const localProps = {
    ...props,
    sendTwoFactorCodeBySMS: jest.fn(),
    sendTwoFactorCodeByCall: jest.fn(),
  }
  mount(<Router>
    <TwoFactorLoginByPhone {...localProps} />
  </Router>)

  expect(localProps.sendTwoFactorCodeBySMS).toHaveBeenCalled()
  expect(localProps.sendTwoFactorCodeByCall).not.toHaveBeenCalled()
})

it('sends code by text when method is specified as call', () => {
  const localProps = {
    ...props,
    match: { params: { method: 'call' } },
    sendTwoFactorCodeBySMS: jest.fn(),
    sendTwoFactorCodeByCall: jest.fn(),
  }
  mount(<Router>
    <TwoFactorLoginByPhone {...localProps} />
  </Router>)

  expect(localProps.sendTwoFactorCodeBySMS).not.toHaveBeenCalled()
  expect(localProps.sendTwoFactorCodeByCall).toHaveBeenCalled()
})

it('shows spinner while sending code', () => {
  const localProps = {
    ...props,
    sendCodeState: REQUEST_STATUS.PENDING,
  }
  const wrapper = mount(<Router>
    <TwoFactorLoginByPhone {...localProps} />
  </Router>)

  expect(wrapper.find(Spinner).length).toEqual(1)
})

it('redirects to verification route when sent code entered into the form', () => {
  const localProps = {
    ...props,
    history: { push: jest.fn() },
    sendCodeState: REQUEST_STATUS.SUCCESS,
  }
  const wrapper = mount(<Router>
    <TwoFactorLoginByPhone {...localProps} />
  </Router>)

  expect(wrapper.find('form').length).toEqual(1)

  const code = '120560'
  changeInputValue(wrapper.find({
    name: 'code'
  }).find('input'), code)
  wrapper.find('form').simulate('submit')

  expect(localProps.history.push).toHaveBeenCalledWith(`/login/twofactor/code/${code}`)
})
