import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'
import { FormGroup } from 'reactstrap'

import { profiles, providers } from 'test/fixtures/analytics'
import { REQUEST_STATUS } from 'constants/common'
import { ListData } from 'store/common/models'
import Spinner from 'components/common/Spinner'
import { ChooseProfileForSite } from './index'


const props = {
  history: { push: e => e },
  match: { params: { server: 'test.fast.io' } },
  userTitle: 'TT',
  providerList: ListData(),
  profileList: ListData(),
  updateSiteDetailState: REQUEST_STATUS.INITIAL,
  loadAnalyticsProviderList: e => e,
  loadAnalyticsProfileList: e => e,
  updateSiteDetail: e => e,
  updateSiteDetailReset: e => e,
}

const data = {
  providerList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: providers,
  }),
  profileList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: profiles,
  }),
}

it('renders initial state', () => {
  const localProps = {
    ...props,
    loadAnalyticsProviderList: jest.fn(),
    loadAnalyticsProfileList: jest.fn(),
  }
  const wrapper = mount(<Router>
    <ChooseProfileForSite {...localProps} />
  </Router>)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
  expect(localProps.loadAnalyticsProviderList).toHaveBeenCalled()
  expect(localProps.loadAnalyticsProfileList).toHaveBeenCalled()
})

it('updates site with selected profile', () => {
  const localProps = {
    ...props,
    ...data,
    loadAnalyticsProviderList: jest.fn(),
    loadAnalyticsProfileList: jest.fn(),
    updateSiteDetail: jest.fn(),
  }
  const wrapper = mount(<Router>
    <ChooseProfileForSite {...localProps} />
  </Router>)

  expect(wrapper.find(Spinner).length).toEqual(0)
  expect(localProps.loadAnalyticsProviderList).not.toHaveBeenCalled()
  expect(localProps.loadAnalyticsProfileList).not.toHaveBeenCalled()

  expect(wrapper.find('button').prop('disabled')).toBe(true)

  wrapper.find(FormGroup).at(1).find('input').simulate('click')
  expect(wrapper.find('button').prop('disabled')).toBe(false)
  wrapper.find('button').simulate('click')

  expect(localProps.updateSiteDetail).toHaveBeenCalledWith({
    server: localProps.match.params.server,
    data: {
      analytics: data.profileList.data.get(1).name,
    }
  })
})
