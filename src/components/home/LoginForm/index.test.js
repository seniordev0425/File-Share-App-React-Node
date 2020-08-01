import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { changeInputValue, timeoutPromise } from 'utils/testTools'
import LoginForm from './index'


it('renders the login form', () => {
  const wrapper = mount(<Router>
    <LoginForm onSubmit={e => e} />
  </Router>)

  expect(wrapper.getDOMNode().tagName).toEqual('FORM')
})

it('renders the form with initial value', async () => {
  const initialValues = {
    username: 'test@fast.io',
    password: 'somepassword'
  }
  const wrapper = mount(<Router>
    <LoginForm
      initialValues={{ ...initialValues }}
      onSubmit={jest.fn()}
    />
  </Router>)

  expect(wrapper.find('input').at(0).props().value).toEqual(initialValues.username)
  expect(wrapper.find('input').at(1).props().value).toEqual(initialValues.password)
})

it('submits data from valid initial values', async () => {
  const initialValues = {
    username: 'test@fast.io',
    password: 'somepassword'
  }
  const handleSubmitMock = jest.fn()
  const wrapper = mount(<Router>
    <LoginForm
      initialValues={{ ...initialValues }}
      onSubmit={handleSubmitMock}
    />
  </Router>)

  wrapper.find('form').simulate('submit')

  expect(handleSubmitMock).toHaveBeenCalledWith(initialValues, expect.any(Object), expect.any(Function))
})

it('validates username', async () => {
  const handleSubmitMock = jest.fn()
  const wrapper = mount(<Router>
    <LoginForm
      initialValues={{
        username: '',
        password: 'somepassword'
      }}
      onSubmit={handleSubmitMock}
    />
  </Router>)

  wrapper.find('form').simulate('submit')
  await timeoutPromise(0)
  expect(handleSubmitMock).not.toHaveBeenCalled()

  changeInputValue(wrapper.find('input[name="username"]'), 'test')
  wrapper.find('form').simulate('submit')
  await timeoutPromise(0)
  expect(handleSubmitMock).not.toHaveBeenCalled()

  changeInputValue(wrapper.find('input[name="username"]'), 'test@fast.io')
  wrapper.find('form').simulate('submit')
  await timeoutPromise(0)
  expect(handleSubmitMock).toHaveBeenCalled()
})

it('validates password', async () => {
  const handleSubmitMock = jest.fn()
  const wrapper = mount(<Router>
    <LoginForm
      initialValues={{
        username: 'test@fast.io',
        password: '',
      }}
      onSubmit={handleSubmitMock}
    />
  </Router>)

  wrapper.find('form').simulate('submit')
  await timeoutPromise(0)
  expect(handleSubmitMock).not.toHaveBeenCalled()

  changeInputValue(wrapper.find('input[name="password"]'), 'somepassword')
  wrapper.find('form').simulate('submit')
  await timeoutPromise(0)
  expect(handleSubmitMock).toHaveBeenCalled()
})

it('submits validated data', async () => {
  const loginData = {
    username: 'test@fast.io',
    password: 'somepassword',
  }
  const handleSubmitMock = jest.fn()
  const wrapper = mount(<Router>
    <LoginForm
      onSubmit={handleSubmitMock}
    />
  </Router>)

  changeInputValue(wrapper.find('input[name="username"]'), loginData.username)
  changeInputValue(wrapper.find('input[name="password"]'), loginData.password)

  wrapper.find('form').simulate('submit')

  expect(handleSubmitMock).toHaveBeenCalledWith(loginData, expect.any(Object), expect.any(Function))
})
