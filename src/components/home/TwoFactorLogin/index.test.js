import React from 'react'
import { mount } from 'enzyme'
import { Redirect } from 'react-router-dom'

import { TWOFACTOR_PREFERENCE } from 'store/modules/twofactor'
import { TwoFactorLogin } from './index'


jest.mock('react-router-dom', () => ({
  Redirect: props => <a href={props.to} />
}))

it('redirects to authy verification by default', () => {
  const localProps = {
    twoFactorPreference: '',
  }
  const wrapper = mount(<TwoFactorLogin {...localProps} />)

  expect(wrapper.find(Redirect).prop('to')).toEqual('/login/twofactor/authy')
})

it('redirects to appropriate verification based on preference', () => {
  const preferenceMap = {
    [TWOFACTOR_PREFERENCE.AUTHY]: '/login/twofactor/authy',
    [TWOFACTOR_PREFERENCE.SMS]: '/login/twofactor/phone/sms',
    [TWOFACTOR_PREFERENCE.CALL]: '/login/twofactor/phone/call',
  }
  Object.keys(preferenceMap).forEach(twoFactorPreference => {
    const localProps = {
      twoFactorPreference,
    }
    const wrapper = mount(<TwoFactorLogin {...localProps} />)

    expect(wrapper.find(Redirect).prop('to')).toEqual(preferenceMap[twoFactorPreference])
  })
})
