import React from 'react'
import { mount } from 'enzyme'

import { changeInputValue } from 'utils/testTools'
import CloseAccountEmailForm from './index'


const props = {
  email: 'test1@fast.io',
  onSubmit: e => e,
}

it('renders the form', () => {
  const wrapper = mount(<CloseAccountEmailForm {...props} />)

  expect(wrapper.find('form').length).toEqual(1)
})

it('submits data when correct email entered', async () => {
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }

  const wrapper = mount(<CloseAccountEmailForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'email_address',
  }).find('input'), 'test1@fast.io')

  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    email_address: 'test1@fast.io',
  })
})

it('should not submit data when incorrect email entered', async () => {
  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }

  const wrapper = mount(<CloseAccountEmailForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'email_address',
  }).find('input'), 'test2@fast.io')

  wrapper.find('form').simulate('submit')

  expect(localProps.onSubmit).not.toHaveBeenCalled()
})
