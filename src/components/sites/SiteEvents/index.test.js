import React from 'react'
import { mount } from 'enzyme'
import { List } from 'immutable'
import { DropdownItem } from 'reactstrap'

import { REQUEST_STATUS } from 'constants/common'
import Spinner from 'components/common/Spinner'
import { ListData, DetailData } from 'store/common/models'
import { Site } from 'store/modules/sites'
import { Event } from 'store/modules/events'
import { SiteEvents } from './index'


const props = {
  siteDetail: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: Site({
      server: 'test.fast.io',
      analytics: null,
    })
  }),
  eventList: ListData(),
  acknowledgeEventState: REQUEST_STATUS.INITIAL,
  loadSiteEventList: e => e,
  acknowledgeEvent: e => e,
  acknowledgeAllSiteEvents: e => e,
}

const data = {
  eventList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: List([
      Event({
        eid: '1',
        server: 'test.fast.io',
        category: 'notice',
        subject: 'A new api key was created',
        desc: 'A new api key was created',
        created: '2019-05-05 00:05:00 UTC',
        acknowledged: false,
      }),
      Event({
        eid: '2',
        server: 'test.fast.io',
        category: 'warning',
        subject: '2-factor authentication was removed',
        desc: '2-factor authentication was removed',
        created: '2019-05-05 00:03:00 UTC',
        acknowledged: false,
      }),
      Event({
        eid: '3',
        server: 'test.fast.io',
        category: 'error',
        subject: 'Failed to upload to site',
        desc: 'Failed to upload to site',
        created: '2019-05-05 00:01:00 UTC',
        acknowledged: false,
      }),
    ])
  })
}

it('renders initial state', () => {
  const localProps = {
    ...props,
    loadSiteEventList: jest.fn(),
  }
  const wrapper = mount(<SiteEvents {...localProps} />)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
  expect(localProps.loadSiteEventList).toHaveBeenCalled()
})

it('renders loaded state', () => {
  const localProps = {
    ...props,
    ...data,
    loadSiteEventList: jest.fn(),
  }
  const wrapper = mount(<SiteEvents {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(0)
  expect(wrapper.find('tbody tr').length).toEqual(localProps.eventList.data.size)
})

it('loaded events should be able to be acknowledged', () => {
  const localProps = {
    ...props,
    ...data,
    acknowledgeEvent: jest.fn(),
    acknowledgeAllSiteEvents: jest.fn(),
  }
  const wrapper = mount(<SiteEvents {...localProps} />)

  wrapper.find('tbody tr').at(0).find(DropdownItem).at(0).simulate('click')
  expect(localProps.acknowledgeEvent).toHaveBeenCalledWith({
    eid: localProps.eventList.data.get(0).eid,
  })

  wrapper.find('h2 + div button').simulate('click')
  expect(localProps.acknowledgeAllSiteEvents).toHaveBeenCalledWith({
    server: 'test.fast.io',
  })
})
