import React from 'react'
import { mount } from 'enzyme'

import APIKeyModal from './index'
import APIKeyForm from '../APIKeyForm'


it('renders modal when opened', () => {
  const props = {
    open: true,
    onToggle: e => e,
    onSubmit: e => e,
  }
  const wrapper = mount(<APIKeyModal {...props} />)

  expect(wrapper.find(APIKeyForm).length).not.toEqual(0)
})
