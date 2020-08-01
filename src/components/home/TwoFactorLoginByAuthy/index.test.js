import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { changeInputValue } from 'utils/testTools'
import { TwoFactorLoginByAuthy } from './index'


const props = {
  history: { push: e => e }
}

it('renders initial state', () => {
  const wrapper = mount(<Router>
    <TwoFactorLoginByAuthy {...props} />
  </Router>)

  expect(wrapper.find('form').length).toEqual(1)
})

it('redirects to code verification route when code entered', () => {
  const code = '123456'
  const localProps = {
    ...props,
    history: { push: jest.fn() },
  }
  const wrapper = mount(<Router>
    <TwoFactorLoginByAuthy {...localProps} />
  </Router>)

  changeInputValue(wrapper.find({
    name: 'code'
  }).find('input'), code)
  wrapper.find('form').simulate('submit')

  expect(localProps.history.push).toHaveBeenCalledWith(`/login/twofactor/code/${code}`)
})
