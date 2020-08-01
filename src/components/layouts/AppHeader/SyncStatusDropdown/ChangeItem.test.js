import React from 'react'
import { mount } from 'enzyme'

import { JOB_STATES } from 'constants/common'
import ChangeItem from './ChangeItem'


const props = {
  server: 'ryan01.fast.io',
  datetime: '2019-05-29 17:30:00 UTC',
  state: JOB_STATES.syncing,
  syncCount: 10,
}

it('should render syncing state', () => {
  const wrapper = mount(<ChangeItem {...props} />)

  expect(wrapper.getDOMNode().classList.contains('is-syncing')).toEqual(true)
})

it('should render pushing state', () => {
  const localProps = {
    ...props,
    state: JOB_STATES.pushing,
  }
  const wrapper = mount(<ChangeItem {...localProps} />)

  expect(wrapper.getDOMNode().classList.contains('is-pushing')).toEqual(true)
})

it('should render completed state', () => {
  const localProps = {
    ...props,
    state: JOB_STATES.complete,
  }
  const wrapper = mount(<ChangeItem {...localProps} />)

  expect(wrapper.getDOMNode().classList.contains('is-complete')).toEqual(true)
})
