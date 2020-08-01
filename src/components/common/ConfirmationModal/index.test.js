import React from 'react'
import { mount } from 'enzyme'
import { ModalHeader, ModalBody, Button } from 'reactstrap'

import ConfirmationModal from './index'


const props = {
  open: false,
  message: 'Confirmation modal confirm message',
  onConfirm: e => e,
  onClose: e => e,
}

it('renders initial state with hidden modal', () => {
  const wrapper = mount(<ConfirmationModal {...props} />)

  expect(wrapper.find('div').length).toEqual(0)
  expect(wrapper.text()).toBeFalsy()
})

it('renders correct title, description and button labels', () => {
  const localProps = {
    ...props,
    open: true,
    heading: 'Modal heading',
    confirmText: "Confirm yay!",
    cancelText: "Cancel please",
  }
  const wrapper = mount(<ConfirmationModal {...localProps} />)

  expect(wrapper.find(ModalHeader).text()).toEqual(localProps.heading)
  expect(wrapper.find(ModalBody).text()).toEqual(localProps.message)
  expect(wrapper.find(Button).at(0).text()).toEqual(localProps.confirmText)
  expect(wrapper.find(Button).at(1).text()).toEqual(localProps.cancelText)
})

it('renders open state with modal displayed', () => {
  const localProps = {
    ...props,
    open: true,
  }
  const wrapper = mount(<ConfirmationModal {...localProps} />)

  expect(wrapper.find('div').length).not.toEqual(0)
  expect(wrapper.text()).toBeTruthy()
})

it('closes modal when cancel button clicked', () => {
  const localProps = {
    ...props,
    open: true,
    onClose: jest.fn(),
  }
  const wrapper = mount(<ConfirmationModal {...localProps} />)

  wrapper.find('button').at(1).simulate('click')

  expect(localProps.onClose).toHaveBeenCalled()
})

it('calls confirm callback and closes modal when confirm button clicked', () => {
  const localProps = {
    ...props,
    open: true,
    onConfirm: jest.fn(),
    onClose: jest.fn(),
  }
  const wrapper = mount(<ConfirmationModal {...localProps} />)

  wrapper.find('button').at(0).simulate('click')

  expect(localProps.onConfirm).toHaveBeenCalled()
  expect(localProps.onClose).toHaveBeenCalled()
})
