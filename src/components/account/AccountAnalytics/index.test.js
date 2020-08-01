import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'
import { List } from 'immutable'
import { Row, Col } from 'reactstrap'

import { REQUEST_STATUS } from 'constants/common'
import { ListData } from 'store/common/models'
import { AnalyticsProfile } from 'store/modules/analytics'
import { AccountAnalytics } from './index'


const props = {
  providerList: ListData(),
  deleteProfileState: REQUEST_STATUS.INITIAL,
  loadAnalyticsProviderList: e => e,
  deleteAnalyticsProfile: e => e,
}

it('renders initial state', () => {
  const localProps = {
    ...props,
    analyticsProfileList: ListData(),
    loadAnalyticsProfileList: jest.fn(),
  }

  mount(<Router>
    <AccountAnalytics {...localProps} />
  </Router>)

  expect(localProps.loadAnalyticsProfileList).toHaveBeenCalled()
})

it('renders loaded state', () => {
  const localProps = {
    ...props,
    analyticsProfileList: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: List([
        AnalyticsProfile({
          name: 'Profile1',
          provider: 'googleprovider',
          token: 'GA-123123',
        }),
        AnalyticsProfile({
          name: 'Profile2',
          provider: 'mixpanel',
          token: 'MX100100',
        }),
      ])
    }),
    loadAnalyticsProfileList: jest.fn(),
  }

  const wrapper = mount(<Router>
    <AccountAnalytics {...localProps} />
  </Router>)

  expect(wrapper.find(Row).length).toEqual(localProps.analyticsProfileList.data.size + 1)
})
