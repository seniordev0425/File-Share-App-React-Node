import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { REQUEST_STATUS } from 'constants/common'
import { ResetPassword } from './index'
import EmailForm from './form'


const props = {
  history: { push: e => e },
  resetPasswordState: REQUEST_STATUS.INITIAL,
  resetPassword: e => e,
}

it('renders page and calls reset password action when email entered', () => {
  const localProps = {
    ...props,
    resetPassword: jest.fn()
  }
  const wrapper = mount(<Router>
    <ResetPassword {...localProps} />
  </Router>)

  expect(wrapper.find(EmailForm).length).not.toEqual(0)

  wrapper.find(EmailForm).prop('onSubmit')({
    email_address: 'tester@fast.io'
  })

  expect(localProps.resetPassword).toHaveBeenCalledWith({
    email_address: 'tester@fast.io'
  })
})
