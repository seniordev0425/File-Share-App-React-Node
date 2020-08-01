import React from 'react'
import { mount } from 'enzyme'

import APIKeyDisplayModal from './index'


it('displays api key', () => {
  const props = {
    open: true,
    onToggle: e => e,
    apiKey: 'generatedapikey123'
  }
  const wrapper = mount(<APIKeyDisplayModal {...props} />)

  expect(wrapper.text()).toContain(props.apiKey)
})
