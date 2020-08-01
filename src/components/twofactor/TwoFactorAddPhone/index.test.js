import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { User } from 'store/modules/user'
import { TwoFactorAddPhone } from './index'
import PhoneNumberForm from './form'


jest.mock('./form', () => () => <div />)

const props = {
  history: { push: e => e },
  match: {},
  user: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: User({
      phone_country: '',
      phone_number: '',
    })
  }),
  updateUserState: REQUEST_STATUS.INITIAL,
  updateUser: e => e,
}

const user = User({
  phone_country: '1',
  phone_number: '5555555556',
})

it('renders initial page', () => {
  const wrapper = mount(<TwoFactorAddPhone {...props} />)

  expect(wrapper.find('section').length).not.toEqual(0)
})

it('redirects to verify authy code page when user has phone number', () => {
  const localProps = {
    ...props,
    history: { push: jest.fn() },
    user: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: user,
    }),
  }
  mount(<TwoFactorAddPhone {...localProps} />)

  expect(localProps.history.push).toHaveBeenCalled()
})

it('should not redirect to verify authy code page when reset param specified', () => {
  const localProps = {
    ...props,
    history: { push: jest.fn() },
    match: { params: { reset: '1' } },
    user: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: user,
    }),
  }
  mount(<TwoFactorAddPhone {...localProps} />)

  expect(localProps.history.push).not.toHaveBeenCalled()
})

it('should update user info when phone number submitted', () => {
  const localProps = {
    ...props,
    updateUser: jest.fn(),
  }
  const wrapper = mount(<TwoFactorAddPhone {...localProps} />)

  act(() => wrapper.find(PhoneNumberForm).prop('onSubmit')({
    call: false,
    phone_country: '1',
    phone_number: '5551235556',
  }))

  expect(localProps.updateUser).toHaveBeenCalledWith({
    data: ({
      phone_country: '1',
      phone_number: '5551235556',
    })
  })
})

const testRedirectAfterUserUpdated = call => {
  const localProps = {
    ...props,
    history: { push: jest.fn() },
    updateUserState: REQUEST_STATUS.PENDING,
  }
  const wrapper = mount(<TwoFactorAddPhone {...localProps} />)

  act(() => wrapper.find(PhoneNumberForm).prop('onSubmit')({
    call,
    phone_country: '1',
    phone_number: '5551235556',
  }))

  wrapper.setProps({
    ...localProps,
    updateUserState: REQUEST_STATUS.SUCCESS,
  })

  expect(localProps.history.push).toHaveBeenCalledWith(`/twofactor/enable/${call ? 'call' : 'sms'}`)
}

it('should redirect when updating user info done', () => {
  testRedirectAfterUserUpdated(true)
  testRedirectAfterUserUpdated(false)
})
