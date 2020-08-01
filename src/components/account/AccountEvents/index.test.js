import React from 'react'
import { mount } from 'enzyme'
import { List } from 'immutable'

import { REQUEST_STATUS } from 'constants/common'
import { ListData } from 'store/common/models'
import { Event } from 'store/modules/events'
import Spinner from 'components/common/Spinner'
import { AccountEvents } from './index'


const props = {
  eventList: ListData(),
  acknowledgeEventState: '',
  loadEventList: e => e,
  acknowledgeEvent: e => e,
}

const data = {
  eventList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: List([
      Event({
        id: '1',
        eid: 'xxosrxxxxx',
        server: null,
        category: 'notice',
        code: 11015,
        subject: 'Subscription Created',
        desc: 'A subscription with the plan 6cPerGBMonthly was created and attached to your account. Thank you for using Fast!',
        created: '2019-04-27 16:11:24 UTC',
        alarm: false,
        acknowledged: null,
        resolved: null
      }),
      Event({
        id: '2',
        eid: 'xxqsrxxxxx',
        server: null,
        category: 'notice',
        code: 11019,
        subject: 'Cloud Storage Provider linked',
        desc: 'The Storage Provider Googledrive was linked to your account.',
        created: '2019-04-27 16:08:09 UTC',
        alarm: true,
        acknowledged: '2019-04-27 16:08:09 UTC',
        resolved: null
      }),
      Event({
        id: '3',
        eid: 'xxssrxxxxx',
        server: null,
        category: 'notice',
        code: 11019,
        subject: 'Cloud Storage Provider linked',
        desc: 'The Storage Provider Dropbox was unlinked to your account.',
        created: '2019-04-27 16:04:31 UTC',
        alarm: false,
        acknowledged: '2019-04-27 16:04:31 UTC',
        resolved: null
      }),
    ]),
  })
}

it('renders initial state', () => {
  const localProps = {
    ...props,
    loadEventList: jest.fn(),
  }
  const wrapper = mount(<AccountEvents {...localProps} />)

  expect(localProps.loadEventList).toHaveBeenCalled()
  expect(wrapper.find(Spinner).length).not.toEqual(0)
})

it('renders loaded state with sorted data in view', () => {
  const localProps = {
    ...props,
    ...data,
    loadEventList: jest.fn(),
  }
  const wrapper = mount(<AccountEvents {...localProps} />)

  expect(localProps.loadEventList).not.toHaveBeenCalled()
  expect(wrapper.find(Spinner).length).toEqual(0)

  expect(wrapper.find('tr').at(1).find('td').at(3).text()).toEqual(data.eventList.data.get(0).desc)
  expect(wrapper.find('tr').at(2).find('td').at(3).text()).toEqual(data.eventList.data.get(1).desc)
  expect(wrapper.find('tr').at(3).find('td').at(3).text()).toEqual(data.eventList.data.get(2).desc)
})
