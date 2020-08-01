import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'
import { ListGroupItem, Button } from 'reactstrap'
import { List } from 'immutable'

import { profiles, providers } from 'test/fixtures/analytics'
import { sites } from 'test/fixtures/sites'
import { REQUEST_STATUS } from 'constants/common'
import { ListData, DetailData } from 'store/common/models'
import NotFound from 'components/common/NotFound'
import Spinner from 'components/common/Spinner'
import ConfirmationModal from 'components/common/ConfirmationModal'
import { AnalyticsProfileDetails } from './index'


const props = {
  history: { push: e => e },
  match: { params: { name: profiles.getIn([0, 'name'])} },
  providerList: ListData(),
  profile: DetailData(),
  siteList: ListData(),
  updateProfileState: REQUEST_STATUS.INITIAL,
  deleteProfileState: REQUEST_STATUS.INITIAL,
  loadAnalyticsProfile: e => e,
  loadAnalyticsProviderList: e => e,
  loadSiteList: e => e,
  updateAnalyticsProfile: e => e,
  deleteAnalyticsProfile: e => e,
}

const data = {
  providerList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: providers,
  }),
  profile: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: profiles.get(0),
  }),
  siteList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: List([
      sites.get(0).set('analytics', profiles.getIn([0, 'name'])),
      sites.get(1),
    ]),
  }),
}

it('renders loading state', () => {
  const localProps = {
    ...props,
    profile: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: profiles.get(0),
    }),
  }

  const wrapper = mount(<Router>
    <AnalyticsProfileDetails {...localProps} />
  </Router>)

  expect(wrapper.find(Spinner).length).toEqual(1)
})

it('renders failed state', () => {
  const localProps = {
    ...props,
    profile: DetailData({
      state: REQUEST_STATUS.FAIL,
      statusCode: 404,
    }),
  }
  const wrapper = mount(<Router>
    <AnalyticsProfileDetails {...localProps} />
  </Router>)

  expect(wrapper.find(NotFound).length).toEqual(1)
})

it('renders loaded state', () => {
  const localProps = {
    ...props,
    ...data,
  }
  const wrapper = mount(<Router>
    <AnalyticsProfileDetails {...localProps} />
  </Router>)

  expect(wrapper.find('h1').text()).toContain(localProps.profile.data.name)
  expect(wrapper.find('h1 + div').text()).toContain(providers.get(0).display)
  expect(wrapper.find('h1 + div').text()).toContain(localProps.profile.data.token)

  // There is 1 site using this profile
  const siteItems = wrapper.find('.js-sites').find(ListGroupItem)
  expect(siteItems.length).toEqual(1)
  expect(siteItems.at(0).text(0)).toContain(sites.get(0).name)
  expect(siteItems.at(0).text(0)).toContain(sites.get(0).server)
})

it('clicking delete button invokes delete action', () => {
  const localProps = {
    ...props,
    ...data,
    deleteAnalyticsProfile: jest.fn(),
  }
  const wrapper = mount(<Router>
    <AnalyticsProfileDetails {...localProps} />
  </Router>)

  // Edit
  wrapper.find(Button).at(1).simulate('click')

  // Now delete
  wrapper.find(Button).at(1).simulate('click')

  // Click confirm button
  wrapper.find(ConfirmationModal).find(Button).at(0).simulate('click')

  expect(localProps.deleteAnalyticsProfile).toHaveBeenCalled()
})
