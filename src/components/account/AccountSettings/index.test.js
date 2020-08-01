import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'
import { Button } from 'reactstrap'

import AccountSettings from './index'


it('renders successfully', () => {
  const wrapper = mount(<Router>
    <AccountSettings />
  </Router>)

  expect(wrapper.find(Button).length).not.toEqual(0)
})
