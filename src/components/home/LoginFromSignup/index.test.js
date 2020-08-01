import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { OAuthResult } from 'store/modules/storage'
import { LoginFromSignup } from './index'
import LoginForm from './form'


const props = {
  oauthResult: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: OAuthResult({
      provider: 'googledrive',
      email: 'tester@fast.io',
      password: null,
    })
  }),
  login: e => e,
}

it('calls action with correct payload', () => {
  const localProps = {
    ...props,
    login: jest.fn()
  }
  const wrapper = mount(<Router>
    <LoginFromSignup {...localProps} />
  </Router>)

  expect(wrapper.find(LoginForm).length).not.toEqual(0)

  wrapper.find(LoginForm).prop('onSubmit')({
    password: 'mypassword'
  })

  expect(localProps.login).toHaveBeenCalledWith({
    username: 'tester@fast.io',
    password: 'mypassword',
  })
})
