import React from 'react'
import { mount } from 'enzyme'
import { List } from 'immutable'

import { changeStatuses, precacheStatuses } from 'test/fixtures/sync'
import { REQUEST_STATUS } from 'constants/common'
import { ListData } from 'store/common/models'
import Spinner from 'components/common/Spinner'
import ChangeItem from './ChangeItem'
import WarningItem from './WarningItem'
import { SyncStatusDropdown } from './index'


const props = {
  changeStatusList: ListData(),
  precacheStatusList: ListData(),
  loadAllChangesStatusList: e => e,
  loadPrecacheStatusList: e => e,
  runStaleChanges: e => e,
}

const data = {
  changeStatusList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: changeStatuses,
  }),
  precacheStatusList: ListData({
    state: REQUEST_STATUS.SUCCESS,
    data: precacheStatuses,
  }),
}

it('should render loading state', () => {
  let localProps = {
    ...props,
    changeStatusList: props.changeStatusList.set('state', REQUEST_STATUS.PENDING),
  }
  let wrapper = mount(<SyncStatusDropdown {...localProps} />)
  expect(wrapper.find(Spinner).length).not.toEqual(0)

  localProps = {
    ...props,
    precacheStatusList: props.precacheStatusList.set('state', REQUEST_STATUS.PENDING),
  }
  wrapper = mount(<SyncStatusDropdown {...localProps} />)
  expect(wrapper.find(Spinner).length).not.toEqual(0)
})

it('should render state of loaded but no jobs exists', () => {
  let localProps = {
    ...props,
    changeStatusList: data.changeStatusList.set('data', List()),
    precacheStatusList: data.precacheStatusList.set('data', List()),
  }
  let wrapper = mount(<SyncStatusDropdown {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(0)
  expect(wrapper.find(ChangeItem).length).toEqual(0)
  expect(wrapper.find(WarningItem).length).toEqual(0)
  expect(wrapper.text()).not.toContain('Pending Changes')
})

it('should render loaded state', () => {
  const localProps = {
    ...props,
    ...data,
  }
  const wrapper = mount(<SyncStatusDropdown {...localProps} />)

  expect(wrapper.find(ChangeItem).length).toEqual(2)
  expect(wrapper.text()).toContain('Pending Changes')
})

it('should should warning and stale states', () => {
  const localProps = {
    ...props,
    changeStatusList: ListData({
      state: REQUEST_STATUS.SUCCESS,
      data: changeStatuses.slice(0, 1).setIn([0, 'stale'], true),
    }),
    precacheStatusList: data.precacheStatusList.setIn(['data', 0, 'status'], 'unknown'),
  }
  const wrapper = mount(<SyncStatusDropdown {...localProps} />)

  expect(wrapper.find(WarningItem).length).toEqual(2)
  expect(wrapper.find(WarningItem).at(0).prop('stale')).toEqual(false)
  expect(wrapper.find(WarningItem).at(1).prop('stale')).toEqual(true)
  expect(wrapper.text()).not.toContain('Pending Changes')
})
