import React from 'react'
import { mount } from 'enzyme'
import { DropdownItem } from 'reactstrap'

import AccountUsageDateFilterForm from './index'
import { changeInputValue, timeoutPromise } from 'utils/testTools'


it('submits entered date range', () => {
  const props = {
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<AccountUsageDateFilterForm {...props} />)

  changeInputValue(wrapper.find({
    name: 'start'
  }).find('input'), '2019-04-10')
  changeInputValue(wrapper.find({
    name: 'end'
  }).find('input'), '2019-04-15')

  wrapper.find('form').simulate('submit')

  expect(props.onSubmit).toHaveBeenCalledWith({
    start: new Date(2019, 3, 10, 0, 0, 0),
    end: new Date(2019, 3, 15, 0, 0, 0)
  })
})

it('submits preset range when selected', () => {
  const props = {
    onSubmit: jest.fn(),
  }
  const wrapper = mount(<AccountUsageDateFilterForm {...props} />)

  wrapper.find('.dropdown-item').at(0).find('button').simulate('click')

  const end = new Date()
  end.setSeconds(0)
  end.setMilliseconds(0)
  const start = new Date(end)
  start.setHours(0)
  start.setMinutes(0)
  start.setMonth(start.getMonth() - 1)

  expect(props.onSubmit).toHaveBeenCalledWith({ start, end })
})
