import React from 'react'
import { mount } from 'enzyme'
import { Map, List } from 'immutable'
import { MemoryRouter as Router } from 'react-router-dom'
import { ListGroupItem } from 'reactstrap'

import { REQUEST_STATUS } from 'constants/common'
import { storages } from 'test/fixtures/storage'
import { storageDetail } from 'test/fixtures/storage'
import { pathDetails } from 'test/fixtures/siteContent'
import { ListData, DetailData } from 'store/common/models'
import { Site } from 'store/modules/sites'
import { Event } from 'store/modules/events'
import { SiteOverview } from './index'


jest.mock('components/common/UsageDateRangePicker', () => () => <span />)
jest.mock('components/common/StatsChart', () => () => <span />)

const props = {
  siteDetail: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: Site({
      id: 1,
      name: 'test1',
      server: 'test1.imfast.io',
      storage: 'googledrive'
    }),
  }),
  storageList: ListData(),
  storageDetail: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: storageDetail,
  }),
  rootDetails: DetailData(),
  siteStatsMap: Map(),
  recentSiteStatsMap: Map(),
  siteEventList: ListData(),
  flushCacheRequestState: REQUEST_STATUS.INITIAL,
  loadSiteStats: e => e,
  loadRecentSiteStats: e => e,
  loadStorageList: e => e,
  loadRootDetails: e => e,
  loadSiteEventList: e => e,
  acknowledgeEvent: e => e,
  precache: e => e,
  manualSync: e => e,
}

const data = {
  storageList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: storages,
  }),
  rootDetails: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: pathDetails,
  }),
  siteEventList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: List([
      Event({
        eid: '1',
        category: 'notice',
        subject: 'Site has been created',
        created: '2019-05-01 10:00:00 UTC',
      }),
      Event({
        eid: '2',
        category: 'warning',
        subject: '2FA has been disabled',
        created: '2019-05-01 10:00:00 UTC',
      }),
      Event({
        eid: '3',
        category: 'error',
        subject: 'Failed to enable 2FA',
        created: '2019-05-01 10:00:00 UTC',
      }),
    ]),
  }),
}

it('renders initial state', () => {
  const localProps = {
    ...props,
    loadSiteStats: jest.fn(),
    loadStorageList: jest.fn(),
    loadSiteEventList: jest.fn(),
  }
  mount(<Router>
    <SiteOverview {...localProps} />
  </Router>)

  expect(localProps.loadSiteStats).toHaveBeenCalled()
  expect(localProps.loadStorageList).toHaveBeenCalled()
  expect(localProps.loadSiteEventList).toHaveBeenCalled()
})

it('renders initial state', () => {
  const localProps = {
    ...props,
    ...data,
  }
  const wrapper = mount(<Router>
    <SiteOverview {...localProps} />
  </Router>)

  expect(wrapper.find(ListGroupItem).length).toEqual(data.siteEventList.data.size)
})
