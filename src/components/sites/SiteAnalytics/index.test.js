import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { List, Map } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import Spinner from 'components/common/Spinner'
import { ListData, DetailData } from 'store/common/models'
import { Site } from 'store/modules/sites'
import { AnalyticsProfile } from 'store/modules/analytics'
import { SiteAnalytics } from './index'
import EmptyProfileList from './emptyProfileList'
import ChooseProfile from './chooseProfile'
import Profile from './profile'


const props = {
  siteDetail: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: Site({
      analytics: null,
    })
  }),
  analyticsProfile: DetailData(),
  analyticsProfileList: ListData(),
  loadAnalyticsProfile: e => e,
  loadAnalyticsProfileList: e => e,
}

const data = {
  siteDetail: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: Site({
      analytics: 'testanalytics',
    })
  }),
  analyticsProfile: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: AnalyticsProfile({
      name: 'testanalytics',
      provider: 'googleanalytics',
      token: 'UA-123123-1',
    }),
    lastRequestPayload: Map({
      name: 'testanalytics',
    })
  }),
  analyticsProfileList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: List([
      AnalyticsProfile({
        name: 'testanalytics',
        provider: 'googleanalytics',
        token: 'UA-123123-1',
      }),
      AnalyticsProfile({
        name: 'anothertestanalytics',
        provider: 'googleanalytics',
        token: 'UA-110110-5',
      })
    ]),
  }),
}

it('renders loading state without analytics profile', () => {
  const localProps = {
    ...props,
    loadAnalyticsProfile: jest.fn(),
    loadAnalyticsProfileList: jest.fn(),
  }
  const wrapper = mount(<MemoryRouter>
    <SiteAnalytics {...localProps} />
  </MemoryRouter>)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
  expect(localProps.loadAnalyticsProfile).not.toHaveBeenCalled()
  expect(localProps.loadAnalyticsProfileList).toHaveBeenCalled()
})

it('renders loading state with analytics profile', () => {
  const localProps = {
    ...props,
    siteDetail: data.siteDetail,
    loadAnalyticsProfile: jest.fn(),
    loadAnalyticsProfileList: jest.fn(),
  }
  const wrapper = mount(<MemoryRouter>
    <SiteAnalytics {...localProps} />
  </MemoryRouter>)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
  expect(localProps.loadAnalyticsProfile).toHaveBeenCalled()
  expect(localProps.loadAnalyticsProfileList).toHaveBeenCalled()
})

it('renders loaded state without analytics profile and list', () => {
  const localProps = {
    ...props,
    analyticsProfileList: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: List(),
    }),
    loadAnalyticsProfile: jest.fn(),
    loadAnalyticsProfileList: jest.fn(),
  }
  const wrapper = mount(<MemoryRouter>
    <SiteAnalytics {...localProps} />
  </MemoryRouter>)

  expect(wrapper.find(Spinner).length).toEqual(0)
  expect(localProps.loadAnalyticsProfile).not.toHaveBeenCalled()
  expect(localProps.loadAnalyticsProfileList).not.toHaveBeenCalled()
  expect(wrapper.find(EmptyProfileList).length).not.toEqual(0)
})

it('renders loaded state without analytics profile', () => {
  const localProps = {
    ...props,
    analyticsProfileList: data.analyticsProfileList,
    loadAnalyticsProfile: jest.fn(),
    loadAnalyticsProfileList: jest.fn(),
  }
  const wrapper = mount(<MemoryRouter>
    <SiteAnalytics {...localProps} />
  </MemoryRouter>)

  expect(wrapper.find(Spinner).length).toEqual(0)
  expect(localProps.loadAnalyticsProfile).not.toHaveBeenCalled()
  expect(localProps.loadAnalyticsProfileList).not.toHaveBeenCalled()
  expect(wrapper.find(ChooseProfile).length).not.toEqual(0)
})

it('renders loading state with analytics profile', () => {
  const localProps = {
    ...props,
    ...data,
    loadAnalyticsProfile: jest.fn(),
    loadAnalyticsProfileList: jest.fn(),
  }
  const wrapper = mount(<MemoryRouter>
    <SiteAnalytics {...localProps} />
  </MemoryRouter>)

  expect(wrapper.find(Spinner).length).toEqual(0)
  expect(localProps.loadAnalyticsProfile).not.toHaveBeenCalled()
  expect(localProps.loadAnalyticsProfileList).not.toHaveBeenCalled()
  expect(wrapper.find(Profile).length).not.toEqual(0)
})
