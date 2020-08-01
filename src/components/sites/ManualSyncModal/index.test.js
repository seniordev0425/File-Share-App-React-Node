import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'
import { Button } from 'reactstrap'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { sites } from 'test/fixtures/sites'
import { storageDetail } from 'test/fixtures/storage'
import { ManualSyncModal } from './index'


const props = {
  show: false,
  handleHide: e => e,
  siteDetail: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: sites.get(0),
  }),
  storageDetail: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: storageDetail,
  }),
  onSubmit: e => e,
}

it('renders initial state', () => {
  const wrapper = mount(<Router>
    <ManualSyncModal {...props} />
  </Router>)

  expect(wrapper.find(Button).length).toEqual(0)
})

it('renders open state', () => {
  const localProps = {
    ...props,
    show: true,
  }
  const wrapper = mount(<Router>
    <ManualSyncModal {...localProps} />
  </Router>)

  expect(wrapper.find('p').length).not.toEqual(0)
  expect(wrapper.find(Button).length).toEqual(2)
})

it('submits with true when clicked confirm button', () => {
  const localProps = {
    ...props,
    show: true,
    handleHide: jest.fn(),
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<Router>
    <ManualSyncModal {...localProps} />
  </Router>)

  wrapper.find(Button).at(0).simulate('click')

  expect(localProps.handleHide).toHaveBeenCalled()
  expect(localProps.onSubmit).toHaveBeenCalledWith(true)
})

it('submits with false when clicked cancel button', () => {
  const localProps = {
    ...props,
    show: true,
    handleHide: jest.fn(),
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<Router>
    <ManualSyncModal {...localProps} />
  </Router>)

  wrapper.find(Button).at(1).simulate('click')

  expect(localProps.handleHide).toHaveBeenCalled()
  expect(localProps.onSubmit).toHaveBeenCalledWith(false)
})
