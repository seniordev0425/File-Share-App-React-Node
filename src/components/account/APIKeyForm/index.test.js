import React from 'react'
import { mount } from 'enzyme'

import { changeInputValue } from 'utils/testTools'
import APIKeyForm from './index'


it('submits entered data', () => {
  const props = {
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<APIKeyForm {...props} />)

  const testMemo = 'This is test memo'

  changeInputValue(wrapper.find({
    name: 'memo',
  }).find('input'), testMemo)

  wrapper.find('form').simulate('submit')

  expect(props.onSubmit).toHaveBeenCalledWith({
    memo: testMemo
  })
})
