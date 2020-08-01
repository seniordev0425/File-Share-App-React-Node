import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'

import { DetailData } from 'store/common/models'
import { AppLayout, OfflineNotice } from './index'
import AppHeader from '../AppHeader'
import Sidebar from '../Sidebar'


jest.mock('../AppHeader')
jest.mock('../Sidebar')

const props = {
  systemStatus: DetailData(),
  user: DetailData(),
  userTitle: 'TT',
  loadSystemStatus: e => e,
  loadUser: e => e,
  logout: e => e,
}

it('should render initial state', () => {
  const wrapper = mount(<AppLayout {...props} />)

  expect(wrapper.find(AppHeader).length).toEqual(1)
  expect(wrapper.find(Sidebar).length).toEqual(1)
  expect(wrapper.find(OfflineNotice).length).toEqual(0)
})

it('should show offline notice when browser becomes offline', async () => {
  const map = {};
  window.addEventListener = jest.fn((event, cb) => {
    map[event] = cb
  })

  const wrapper = mount(<AppLayout {...props} />)

  Object.defineProperty(window.navigator, 'onLine', {
    value: false
  })
  act(() => {
    map.offline()
  })
  wrapper.update()

  expect(wrapper.find(OfflineNotice).length).toEqual(1)
})
