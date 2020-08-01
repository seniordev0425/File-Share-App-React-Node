import React from 'react'
import { mount } from 'enzyme'

import WarningItem from './WarningItem'


const props = {
  server: 'ryan01.fast.io',
  datetime: '2019-05-28 11:30:00 UTC',
  stale: false,
}

it('should render warning state', () => {
  const wrapper = mount(<WarningItem {...props} />)

  expect(wrapper.find('.UpdateItem-status').length).toEqual(0)
  expect(wrapper.find('button').length).toEqual(0)
})

it('should render stale state', () => {
  const localProps = {
    ...props,
    stale: true,
    onClickComplete: e => e,
  }
  const wrapper = mount(<WarningItem {...localProps} />)

  expect(wrapper.find('button').text()).toEqual('Complete Sync')
})
