import React from 'react'
import { mount } from 'enzyme'
import mockAxios from 'axios'

import FormPhoneInput from 'components/common/FormPhoneInput'
import { changeInputValue, timeoutPromise } from 'utils/testTools'
import AccountUserPhoneForm from './index'


mockAxios.get.mockImplementation(() => Promise.resolve({
  data: { result: true }
}))

it('renders the form with initial value', async () => {
  const localProps = {
    initialValues: {
      phone_country: '1',
      phone_number: '2025550103'
    },
    onSubmit: e => e,
  }

  const wrapper = mount(<AccountUserPhoneForm {...localProps} />)

  expect(wrapper.find('input').prop('value')).toEqual('+1 (202) 555-0103')
})

it('submits data from valid values', async () => {
  const localProps = {
    onSubmit: jest.fn(),
  }

  const wrapper = mount(<AccountUserPhoneForm {...localProps} />)

  const formInputWrapper = wrapper.find(FormPhoneInput)
  changeInputValue(formInputWrapper.find('input'), '01632960315')

  formInputWrapper.find('input').simulate('blur')

  wrapper.find('form').simulate('submit')

  await timeoutPromise(0)

  // should be triggered once, but 3 times due to final-form issue
  // https://github.com/final-form/react-final-form/issues/320
  expect(mockAxios.get).toHaveBeenCalledTimes(3)

  expect(localProps.onSubmit).toHaveBeenCalledWith({
    phone_country: '1',
    phone_number: '01632960315'
  }, expect.any(Object), expect.any(Function))
})
