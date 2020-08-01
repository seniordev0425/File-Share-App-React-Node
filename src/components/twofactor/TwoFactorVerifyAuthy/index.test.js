import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { REQUEST_STATUS } from 'constants/common'
import Spinner from 'components/common/Spinner'
import { TwoFactorVerifyAuthy } from '.'
import TwoFactorCodeForm from 'components/common/TwoFactorCodeForm'


jest.mock('components/common/TwoFactorCodeForm', () => () => <form />)

const props = {
  history: { push: e => e },
  verifyCodeState: REQUEST_STATUS.INITIAL,
  verifyCodeResult: '',
  verifyTwoFactor: e => e,
  setTwoFactorPreference: e => e,
}

it('should render initial state', () => {
  const wrapper = mount(<Router>
    <TwoFactorVerifyAuthy {...props} />
  </Router>)

  expect(wrapper.find(TwoFactorCodeForm).length).not.toEqual(0)
})

it('should verify code when entered', () => {
  const localProps = {
    ...props,
    verifyTwoFactor: jest.fn(),
    setTwoFactorPreference: jest.fn(),
  }
  const wrapper = mount(<Router>
    <TwoFactorVerifyAuthy {...localProps} />
  </Router>)

  const formWrapper = wrapper.find(TwoFactorCodeForm)
  formWrapper.prop('onSubmit')({
    code: '610550'
  })

  expect(localProps.verifyTwoFactor).toHaveBeenCalledWith({
    code: '610550'
  })
  expect(localProps.setTwoFactorPreference).toHaveBeenCalled()
})

it('should redirect back when code verified', () => {
  const TestComponent = props => <Router>
    <TwoFactorVerifyAuthy {...props} />
  </Router>

  const localProps = {
    ...props,
    history: { push: jest.fn() },
    verifyCodeState: REQUEST_STATUS.PENDING,
  }

  const wrapper = mount(<TestComponent {...localProps} />)

  wrapper.setProps({
    ...localProps,
    verifyCodeState: REQUEST_STATUS.SUCCESS,
  })

  expect(localProps.history.push).toHaveBeenCalled()
})
