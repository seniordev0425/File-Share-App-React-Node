import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import ErrorPage from './page'
import ErrorForm from './errorForm'


const props = {
  error: new Error('Dummy error'),
  onCancel: e => e,
  onSubmit: e => e,
}

it('renders initial error page', () => {
  const wrapper = mount(<Router>
    <ErrorPage {...props} />
  </Router>)

  expect(wrapper.find('form').length).toEqual(1)
  expect(wrapper.find('div').length).not.toEqual(0)
})

it('canceling from form should invoke onCancel', () => {
  const localProps = {
    ...props,
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<Router>
    <ErrorPage {...localProps} />
  </Router>)

  wrapper.find(ErrorForm).prop('onCancel')()

  expect(localProps.onCancel).toHaveBeenCalled()
  expect(localProps.onSubmit).not.toHaveBeenCalled()
})

it('submission from form should invoke onSubmit', () => {
  const localProps = {
    ...props,
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<Router>
    <ErrorPage {...localProps} />
  </Router>)

  const errorData = {
    errorCode: `Test code:\nerror at function() at index.js:32`
  }
  wrapper.find(ErrorForm).prop('onSubmit')(errorData)

  expect(localProps.onCancel).not.toHaveBeenCalled()
  expect(localProps.onSubmit).toHaveBeenCalledWith(errorData)
})
