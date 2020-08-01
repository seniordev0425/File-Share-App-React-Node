import React from 'react'
import { mount } from 'enzyme'

import { changeInputValue } from 'utils/testTools'
import EmailForm from './form'


const props = {
  onSubmit: e => e,
}

it('renders initial state', () => {
  const wrapper = mount(<EmailForm {...props} />)

  expect(wrapper.find('form').length).toEqual(1)
})

it('submits entered password', () => {
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<EmailForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'email_address',
  }).find('input'), 'tester@fast.io')

  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    email_address: 'tester@fast.io',
  })
})
