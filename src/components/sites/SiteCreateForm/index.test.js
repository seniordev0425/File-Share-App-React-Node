import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'
import mockAxios from 'axios'
import { List } from 'immutable'

import { storages } from 'test/fixtures/storage'
import {
  changeInputValue, submitWizardStep, timeoutPromise
} from 'utils/testTools'
import SiteCreateForm from './index'


const props = {
  storageList: List(),
  onSubmit: e => e,
  renderConfirmationPage: e => e,
}
const setTimeoutOriginal = global.setTimeout
jest.useFakeTimers()
const setTimeoutMocked = global.setTimeout

it('should render initial state', () => {
  const wrapper = mount(<SiteCreateForm {...props} />)

  expect(wrapper.find('form').length).not.toEqual(0)
})

it('should submit valid form data', async () => {
  const testData = {
    desc: 'Tom\'s Website',
    name: 'mysite',
  }

  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }

  mockAxios.get.mockImplementationOnce(() => Promise.resolve({
    data: { result: true }
  }))

  const wrapper = mount(<SiteCreateForm {...localProps} />)

  // Step 1
  changeInputValue(wrapper.find({ name: 'desc' }).find('input'), testData.desc)
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'desc' }).length).toEqual(0)

  // Step 2
  wrapper.find({ name: 'websiteConfig' }).find('input').at(0).simulate('change')
  // act(() => submitWizardStep(wrapper))
  submitWizardStep(wrapper)
  expect(wrapper.text()).not.toContain('Choose a configuration')

  // Step 3
  changeInputValue(wrapper.find({ name: 'name' }).find('input'), testData.name)
  wrapper.find({ name: 'name' }).find('input').simulate('blur')
  submitWizardStep(wrapper)
  global.setTimeout = setTimeoutOriginal
  await timeoutPromise(0)
  global.setTimeout = setTimeoutMocked

  // should be triggered once, but 3 times due to final-form issue
  // https://github.com/final-form/react-final-form/issues/320
  expect(mockAxios.get).toHaveBeenCalledTimes(3)
})

it('should submit valid form data when multiple storages available', async () => {
  const testData = {
    desc: 'Tom\'s Website',
    name: 'mysite',
  }

  const localProps = {
    ...props,
    storageList: storages,
    onSubmit: jest.fn(),
  }

  mockAxios.get.mockImplementationOnce(() => Promise.resolve({
    data: { result: true }
  }))

  const wrapper = mount(<Router>
    <SiteCreateForm {...localProps} />
  </Router>)

  // Step 1
  changeInputValue(wrapper.find({ name: 'desc' }).find('input'), testData.desc)
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'desc' }).length).toEqual(0)

  // Step 2
  wrapper.find({ name: 'websiteConfig' }).find('input').at(0).simulate('change')
  // act(() => submitWizardStep(wrapper))
  submitWizardStep(wrapper)
  expect(wrapper.text()).not.toContain('Choose a configuration')

  // Step 3
  wrapper.find({ name: 'storage' }).find('input').at(0).simulate('change')
  // act(() => submitWizardStep(wrapper))
  submitWizardStep(wrapper)
  expect(wrapper.text()).not.toContain('Choose a storage provider')

  // Step 4
  changeInputValue(wrapper.find({ name: 'name' }).find('input'), testData.name)
  submitWizardStep(wrapper)

  // should be triggered once, but 3 times due to final-form issue
  // https://github.com/final-form/react-final-form/issues/320
  expect(mockAxios.get).toHaveBeenCalledTimes(3)
})
