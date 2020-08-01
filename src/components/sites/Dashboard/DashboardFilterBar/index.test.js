import React from 'react'
import { mount } from 'enzyme'
import { UncontrolledDropdown, DropdownItem } from 'reactstrap'

import { storages } from 'test/fixtures/storage'
import Spinner from 'components/common/Spinner'
import DashboardFilterBar, { SORT_MODES } from './index'


const props = {
  storageList: null,
  storageFilter: null,
  onChangeStorageFilter: e => e,
  sort: SORT_MODES.mostRecent,
  onChangeSort: e => e,
}

it('renders loading state', () => {
  const wrapper = mount(<DashboardFilterBar {...props} />)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
})

it('renders loaded state', () => {
  const localProps = {
    ...props,
    storageList: storages,
  }
  const wrapper = mount(<DashboardFilterBar {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(0)
  expect(wrapper.find(UncontrolledDropdown).at(0).find(DropdownItem).length).toEqual(
    storages.size + 1
  )
  expect(wrapper.find(UncontrolledDropdown).at(1).find(DropdownItem).length).toEqual(
    Object.keys(SORT_MODES).length
  )
})

it('calls change storage filter handler when clicked on dropdown menu item', () => {
  const localProps = {
    ...props,
    storageList: storages,
    onChangeStorageFilter: jest.fn(),
  }
  const wrapper = mount(<DashboardFilterBar {...localProps} />)

  wrapper.find(UncontrolledDropdown).at(0).find(DropdownItem).at(2).prop('onClick')()
  expect(localProps.onChangeStorageFilter).toHaveBeenCalledWith(storages.get(1))

  wrapper.find(UncontrolledDropdown).at(0).find(DropdownItem).at(0).prop('onClick')()
  expect(localProps.onChangeStorageFilter).toHaveBeenCalledWith(null)
})

it('calls change sort filter handler when clicked on dropdown menu item', () => {
  const localProps = {
    ...props,
    storageList: storages,
    onChangeSort: jest.fn(),
  }
  const wrapper = mount(<DashboardFilterBar {...localProps} />)

  wrapper.find(UncontrolledDropdown).at(1).find(DropdownItem).at(1).prop('onClick')()
  expect(localProps.onChangeSort).toHaveBeenCalledWith(Object.keys(SORT_MODES)[1])
})
