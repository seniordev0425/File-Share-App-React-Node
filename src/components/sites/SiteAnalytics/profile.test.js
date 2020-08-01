import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter, Link } from 'react-router-dom'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { AnalyticsProfile } from 'store/modules/analytics'
import Profile from './profile'


const props = {
  profile: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    detail: AnalyticsProfile(),
  }),
  server: 'test.fast.io',
}

it('renders state of analytics missing', () => {
  const wrapper = mount(<MemoryRouter>
    <Profile {...props} />
  </MemoryRouter>)

  expect(wrapper.find(Link).length).not.toEqual(0)
})
