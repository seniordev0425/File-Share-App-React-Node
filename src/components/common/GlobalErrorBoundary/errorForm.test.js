import React from 'react'
import { mount } from 'enzyme'

import { changeInputValue } from 'utils/testTools'
import ErrorForm from './errorForm'


const props = {
  error: new Error('Dummy error'),
  onCancel: e => e,
  onSubmit: e => e,
}

it('renders initial form', () => {
  const wrapper = mount(<ErrorForm {...props} />)

  expect(wrapper.find('form').length).toEqual(1)
})

it('clicking on Don\'t Send button should invoke onCancel', () => {
  const localProps = {
    ...props,
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<ErrorForm {...localProps} />)

  wrapper.find('button').at(0).simulate('click')

  expect(localProps.onCancel).toHaveBeenCalled()
  expect(localProps.onSubmit).not.toHaveBeenCalled()
})

it('entering code and clicking on Submit button should invoke onSubmit', () => {
  const localProps = {
    ...props,
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<ErrorForm {...localProps} />)

  const errorCode = `Test code:\nerror at function() at index.js:32`
  changeInputValue(wrapper.find({
    name: 'errorCode'
  }).find('textarea'), errorCode)

  wrapper.find('form').simulate('submit')

  expect(localProps.onCancel).not.toHaveBeenCalled()
  expect(localProps.onSubmit).toHaveBeenCalledWith({
    errorCode,
  })
})
