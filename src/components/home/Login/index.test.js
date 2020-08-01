import React from 'react'
import { shallow } from 'enzyme'

import { REQUEST_STATUS } from 'constants/common'
import { Login } from './index'
import LoginForm from '../LoginForm'
import { handleLoginFormFieldError } from 'utils/formErrors'

const props = {
  loginState: REQUEST_STATUS.INITIAL,
  login: e => e,
}

it('renders login form properly', () => {
  const wrapper = shallow(<Login {...props} />)

  expect(wrapper.find(LoginForm).length).toEqual(1)
})

it('login action is called when form submits', () => {
  const localProps = {
    ...props,
    login: jest.fn(),
  }
  const loginData = {
    username: 'test@fast.io',
    password: 'abcde123',
  }
  const wrapper = shallow(<Login {...localProps} />)

  wrapper.find(LoginForm).props().onSubmit(loginData)
  expect(localProps.login).toHaveBeenCalledWith({
    ...loginData, 
    meta: {
      form: { callback: undefined, errorHandler: handleLoginFormFieldError }
    }
  })
})
