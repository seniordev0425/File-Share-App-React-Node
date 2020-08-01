import React from 'react'
import { mount } from 'enzyme'
import mockAxios from 'axios'

import { changeInputValue, timeoutPromise } from 'utils/testTools'
import AccountUserEmailForm from './index'


const props = {
  initialValues: {
    email_address: 'test@fast.io',
  },
  onSubmit: e => e,
}

it('renders the form with initial value', async () => {
  mockAxios.get.mockImplementation(() => Promise.resolve({
    data: { result: true }
  }))

  await timeoutPromise(0)

  const wrapper = mount(<AccountUserEmailForm {...props} />)

  expect(wrapper.find('form').length).toEqual(1)
  expect(wrapper.find({
    name: 'email_address',
  }).find('input').prop('value')).toEqual(props.initialValues.email_address)
})

it('submits data from valid values', async () => {
  const localProps = {
    initialValues: {
      email_address: '',
    },
    onSubmit: jest.fn(),
  }

  mockAxios.get.mockImplementation(() => Promise.resolve({
    data: { result: true }
  }))

  await timeoutPromise(0)

  const wrapper = mount(<AccountUserEmailForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'email_address',
  }).find('input'), 'test1@fast.io')

  wrapper.find({ name: 'email_address' }).find('input').simulate('blur')

  wrapper.find('form').simulate('submit')

  await timeoutPromise(10)

  // should be triggered once, but 3 times due to final-form issue
  // https://github.com/final-form/react-final-form/issues/320
  expect(mockAxios.get).toHaveBeenCalledTimes(3)
  expect(localProps.onSubmit).toHaveBeenCalledWith({
    email_address: 'test1@fast.io',
  }, expect.any(Object), expect.any(Function))
})

it('should not submit data from invalid values', async () => {
  const localProps = {
    initialValues: {
      email_address: '',
    },
    onSubmit: jest.fn(),
  }

  mockAxios.get.mockImplementation(() => Promise.resolve({
    data: { result: false }
  }))

  await timeoutPromise(10)

  const wrapper = mount(<AccountUserEmailForm {...localProps} />)

  changeInputValue(wrapper.find({
    name: 'email_address',
  }).find('input'), 'test1@fast.io')

  wrapper.find('form').simulate('submit')

  // should be triggered once, but 3 times due to final-form issue
  // https://github.com/final-form/react-final-form/issues/320
  expect(mockAxios.get).toHaveBeenCalledTimes(3)
  expect(localProps.onSubmit).not.toHaveBeenCalled()
})
