import React from 'react'
import { mount } from 'enzyme'
import { UncontrolledTooltip } from 'reactstrap'

import Tooltip from './index'

describe('Tooltip', () => {
  it('renders children correctly', () => {
    const props = {
      children: <span>hover me</span>,
      tooltip: 'tooltip text',
      placement: 'top'
    }
    const wrapper = mount(<Tooltip {...props} />)

    expect(wrapper.find(UncontrolledTooltip).length).toBe(1)
    expect(wrapper.find(UncontrolledTooltip).prop('children')).toEqual(props.tooltip)
    expect(wrapper.find('.js-tooltip-anchor').prop('children')).toEqual(props.children)
  })
})
