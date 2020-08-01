import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { GlobalErrorBoundary } from './index'
import ErrorForm from './errorForm'


jest.mock('utils/analytics', () => ({
  reportError: jest.fn(),
}))

const props = {
  history: { push: e => e },
}

it('renders children when error not occurred', () => {
  const wrapper = mount(<Router>
    <GlobalErrorBoundary {...props}>
      <div className="childrenContentMock" />
    </GlobalErrorBoundary>
  </Router>)

  expect(wrapper.find('.childrenContentMock').length).toEqual(1)
})

it('renders error page when error occurred', () => {
  const originalConsoleError = console.error
  const originalConsoleLog = console.log
  console.error = jest.fn()
  console.log = jest.fn()

  const localProps = {
    ...props,
    history: { push: jest.fn() },
  }
  const TestComponentWithError = () => {
    throw new Error('Error occurred!')
  }
  const wrapper = mount(<Router>
    <GlobalErrorBoundary {...localProps}>
      <TestComponentWithError />
      <div className="childrenContentMock" />
    </GlobalErrorBoundary>
  </Router>)

  expect(wrapper.find('form').length).toEqual(1)
  expect(wrapper.find('.childrenContentMock').length).toEqual(0)

  // Test clicking Don't Send button
  wrapper.find('button').at(0).simulate('click')
  expect(localProps.history.push).toHaveBeenCalledWith('/')
  localProps.history.push.mockReset()

  // Test sending error data
  const errorData = {
    errorCode: `Test code:\nerror at function() at index.js:32`
  }
  wrapper.find(ErrorForm).prop('onSubmit')(errorData)
  expect(localProps.history.push).toHaveBeenCalledWith('/report-error/done')

  console.error = originalConsoleError
  console.log = originalConsoleLog
})
