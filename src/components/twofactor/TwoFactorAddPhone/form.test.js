import React from 'react'
import { mount } from 'enzyme'
import mockAxios from 'axios'
import { MemoryRouter as Router } from 'react-router-dom'
import ReactTelInput from 'react-telephone-input/lib/withStyles'

import FormPhoneInput from 'components/common/FormPhoneInput'
import { changeInputValue, timeoutPromise } from 'utils/testTools'
import PhoneNumberForm from './form'


it('renders initial form', () => {
  const wrapper = mount(<PhoneNumberForm onSubmit={e => e} />)

  expect(wrapper.find('form').length).not.toEqual(0)
})

it('submits entered phone number when valid', async () => {
  mockAxios.get.mockImplementation(() => Promise.resolve({
    data: { result: true }
  }))

  await new Promise(resolve => setTimeout(resolve, 0))

  const localProps = {
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<Router>
    <PhoneNumberForm {...localProps} />
  </Router>)

  wrapper.find(ReactTelInput).prop('onChange')('+15555555556', {
    dialCode: '1',
  })

  const formInputWrapper = wrapper.find(FormPhoneInput)
  changeInputValue(formInputWrapper.find('input'), '+15555555556')
  formInputWrapper.find('input').simulate('blur')
  wrapper.find('form').simulate('submit')

  await timeoutPromise(0)

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    call: false,
    phone_country: '1',
    phone_number: '5555555556',
  })
})

it('should not submit entered phone number when api check failed', async () => {
  mockAxios.get.mockImplementation(() => Promise.resolve({
    data: { result: false }
  }))

  await timeoutPromise(0)

  const localProps = {
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<Router>
    <PhoneNumberForm {...localProps} />
  </Router>)

  wrapper.find(ReactTelInput).prop('onChange')('+15555555556', {
    dialCode: '1',
  })
  wrapper.find('form').simulate('submit')

  await timeoutPromise(0)

  expect(localProps.onSubmit).not.toHaveBeenCalledWith()
})

it('submits entered phone number with call=true when link clicked', async () => {
  mockAxios.get.mockImplementation(() => Promise.resolve({
    data: { result: true }
  }))

  await timeoutPromise(0)

  const localProps = {
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<Router>
    <PhoneNumberForm {...localProps} />
  </Router>)

  wrapper.find(ReactTelInput).prop('onChange')('+15555555556', {
    dialCode: '1',
  })
  wrapper.find('a').simulate('click')
  wrapper.find('form').simulate('submit')

  await timeoutPromise(0)

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    call: true,
    phone_country: '1',
    phone_number: '5555555556',
  })
})
