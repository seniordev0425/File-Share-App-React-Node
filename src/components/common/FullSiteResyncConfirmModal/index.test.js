import React from 'react'
import { mount } from 'enzyme'
import { Button } from 'reactstrap'

import { FullSiteResyncConfirmModal } from './index'


const props = {
  show: false,
  handleHide: e => e,
  onSubmit: e => e,
}

it('renders initial state', () => {
  const wrapper = mount(<FullSiteResyncConfirmModal {...props} />)

  expect(wrapper.find(Button).length).toEqual(0)
})

it('renders open state', () => {
  const localProps = {
    ...props,
    show: true,
  }
  const wrapper = mount(<FullSiteResyncConfirmModal {...localProps} />)

  expect(wrapper.text()).toContain('The change you are requesting will sync the entire site and all of its files')
  expect(wrapper.find(Button).length).toEqual(2)
})

it('submits with true when clicked confirm button', () => {
  const localProps = {
    ...props,
    show: true,
    handleHide: jest.fn(),
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<FullSiteResyncConfirmModal {...localProps} />)

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
  const wrapper = mount(<FullSiteResyncConfirmModal {...localProps} />)

  wrapper.find(Button).at(1).simulate('click')

  expect(localProps.handleHide).toHaveBeenCalled()
  expect(localProps.onSubmit).toHaveBeenCalledWith(false)
})
