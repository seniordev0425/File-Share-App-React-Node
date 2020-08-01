import React from 'react'
import { mount } from 'enzyme'

import { changeInputValue } from 'utils/testTools'
import LoginForm from './form'


const props = {
  email: 'tester@fast.io',
  onSubmit: e => e,
}

it('renders initial state', () => {
  const wrapper = mount(<LoginForm {...props} />)

  expect(wrapper.find('form').length).toEqual(1)
  expect(wrapper.find('input').at(0).prop('value')).toEqual(props.email)
})

it('submits entered password', () => {
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<LoginForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'password',
  }).find('input'), 'passwordfornewaccount')

  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    password: 'passwordfornewaccount',
  })
})
