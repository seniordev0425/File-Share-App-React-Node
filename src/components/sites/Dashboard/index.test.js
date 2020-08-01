import React from 'react'
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { MemoryRouter as Router } from 'react-router-dom'

import { storages } from 'test/fixtures/storage'
import { sites } from 'test/fixtures/sites'
import { ListData } from 'store/common/models'
import { REQUEST_STATUS } from 'constants/common'
import Spinner from 'components/common/Spinner'
import SiteListItem from '../SiteListItem'
import { Dashboard } from './index'
import DashboardFilterBar from './DashboardFilterBar'


const props = {
  userTitle: 'TT',
  siteList: ListData(),
  storageList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: storages,
  }),
  loadSiteList: jest.fn(),
  loadStorageList: jest.fn(),
}

jest.mock('../SiteListItem', () => () => <span />)

it('renders loading state', () => {
  const wrapper = shallow(<Dashboard {...props} />)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
})

it('renders failed state', () => {
  const localProps = {
    ...props,
    siteList: ListData({
      state: REQUEST_STATUS.FAIL,
    })
  }
  const wrapper = shallow(<Dashboard {...localProps} />)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
})

it('renders loaded state', () => {
  const localProps = {
    ...props,
    siteList: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: sites,
    })
  }
  const wrapper = shallow(<Dashboard {...localProps} />)

  expect(wrapper.find(SiteListItem).length).toEqual(sites.size)
})

it('renders filtered sites', () => {
  const localProps = {
    ...props,
    siteList: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: sites,
    })
  }
  const wrapper = mount(<Router>
    <Dashboard {...localProps} />
  </Router>)

  const storageFilter = storages.get(1)
  act(() => {
    wrapper.find(DashboardFilterBar).prop('onChangeStorageFilter')(storageFilter)
  })
  wrapper.update()

  const filteredSites = sites.filter(site => site.storage === storageFilter.name)
  for (let i = 0; i < filteredSites.size; i += 1) {
    expect(wrapper.find(SiteListItem).at(i).prop('site').server).toEqual(filteredSites.get(i).server)
  }
})

it('renders sorted sites', () => {
  const localProps = {
    ...props,
    siteList: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: sites,
    })
  }
  const wrapper = mount(<Router>
    <Dashboard {...localProps} />
  </Router>)

  act(() => {
    wrapper.find(DashboardFilterBar).prop('onChangeSort')('enabled')
  })
  wrapper.update()

  const sortedOrder = [1, 0, 2]
  for (let i = 0; i < sites.size; i += 1) {
    expect(wrapper.find(SiteListItem).at(i).prop('site').server).toEqual(
      sites.get(sortedOrder[i]).server)
  }
})
