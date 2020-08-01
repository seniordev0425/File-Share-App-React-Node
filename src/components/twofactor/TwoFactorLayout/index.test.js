import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import TwoFactorLayout from './index'


it('renders children', () => {
  const wrapper = mount(<Router>
      <TwoFactorLayout>
      <div className="child-for-testing" />
    </TwoFactorLayout>
  </Router>)

  expect(wrapper.find('.child-for-testing').length).toEqual(1)
})
