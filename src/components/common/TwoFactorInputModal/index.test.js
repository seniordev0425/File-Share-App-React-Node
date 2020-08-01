import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { changeInputValue } from 'utils/testTools'
import { TwoFactorInputModal } from './index'


it('submits entered value', () => {
  const props = {
    show: true,
    handleHide: e => e,
    onSubmit: jest.fn(),
    onClose: jest.fn(),
  }
  const wrapper = mount(<TwoFactorInputModal {...props} />)

  changeInputValue(wrapper.find('input'), '156789')

  wrapper.find('form').simulate('submit')

  expect(props.onSubmit).toHaveBeenCalledWith({
    code: '156789',
  })
})
