import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import {
  changeInputValue, submitWizardStep,
} from 'utils/testTools'
import AnalyticsProfileCreateForm from './index'


const props = {
  onSubmit: e => e,
  renderConfirmationPage: () => <div className="js-render-confirmation-page" />,
}

jest.useFakeTimers()

it('should submit valid form data', async () => {
  const testData = {
    name: 'myanalytics',
    token: 'sometokenhere1',
  }

  const localProps = {
    ...props,
    onSubmit: jest.fn(),
  }

  const wrapper = mount(<AnalyticsProfileCreateForm {...localProps} />)

  // Step 1
  changeInputValue(wrapper.find({ name: 'name' }).find('input'), '')
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'name' }).length).not.toEqual(0)

  changeInputValue(wrapper.find({ name: 'name' }).find('input'), testData.name)
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'name' }).length).toEqual(0)

  // Step 2
  changeInputValue(wrapper.find({ name: 'token' }).find('input'), '')
  submitWizardStep(wrapper)
  expect(wrapper.find({ name: 'token' }).length).not.toEqual(0)
  expect(localProps.onSubmit).not.toHaveBeenCalled()

  changeInputValue(wrapper.find({ name: 'token' }).find('input'), testData.token)
  submitWizardStep(wrapper)

  act(() => {
    jest.advanceTimersByTime(50)
  })
  expect(localProps.onSubmit).toHaveBeenCalledWith(testData)

  wrapper.setProps({
    ...localProps,
    submitted: true,
  })
  act(() => {
    jest.advanceTimersByTime(500)
  })
  wrapper.update()
  expect(wrapper.find('.js-render-confirmation-page').length).not.toEqual(0)
})
