import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { AnalyticsProfileDeleted } from './index'


it('should go through wizard to create profile', () => {
  const props = {
    match: { params: { name: 'Test Analytics' } },
  }
  const wrapper = mount(<Router>
    <AnalyticsProfileDeleted {...props} />
  </Router>)

  expect(wrapper.find('h1').text()).toContain(props.match.params.name)
})
