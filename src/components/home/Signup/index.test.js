import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router, Link } from 'react-router-dom'
import { Button } from 'reactstrap'

import Signup from './index'


it('renders page successfully', () => {
  const wrapper = mount(<Router>
    <Signup />
  </Router>)

  expect(wrapper.find(Button).length).toEqual(5)
})
