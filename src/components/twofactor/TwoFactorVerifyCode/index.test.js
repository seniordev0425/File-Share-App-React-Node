import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { User } from 'store/modules/user'
import Spinner from 'components/common/Spinner'
import { TwoFactorVerifyCode } from '.'
import TwoFactorCodeForm from 'components/common/TwoFactorCodeForm'


jest.mock('components/common/TwoFactorCodeForm', () => () => <form />)

const props = {
  history: { push: e => e },
  match: { params: { method: 'call' } },
  user: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: User({
      phone_country: '1',
      phone_number: '5551235556',
    }),
  }),
  verifyCodeState: REQUEST_STATUS.INITIAL,
  verifyCodeResult: '',
  verifyTwoFactor: e => e,
  setTwoFactorPreference: e => e,
}

it('should render initial state', () => {
  const wrapper = mount(<Router>
    <TwoFactorVerifyCode {...props} />
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
    <TwoFactorVerifyCode {...localProps} />
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
    <TwoFactorVerifyCode {...props} />
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
