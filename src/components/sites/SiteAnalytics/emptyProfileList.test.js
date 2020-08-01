import React from 'react'
import { mount } from 'enzyme'
import { Link, MemoryRouter as Router } from 'react-router-dom'

import EmptyProfileList from './emptyProfileList'


it('renders content', () => {
  const wrapper = mount(<Router>
    <EmptyProfileList />
  </Router>)

  expect(wrapper.find(Link).length).not.toEqual(0)
})
