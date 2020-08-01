import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter, Link } from 'react-router-dom'

import ChooseProfile from './chooseProfile'


it('renders state of analytics missing', () => {
  const wrapper = mount(<MemoryRouter>
    <ChooseProfile server="test.fast.io" />
  </MemoryRouter>)

  expect(wrapper.find(Link).length).not.toEqual(0)
})
