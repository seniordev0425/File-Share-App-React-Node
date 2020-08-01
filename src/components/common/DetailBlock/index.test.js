import React from 'react'
import { mount } from 'enzyme'

import DetailBlock from './index'

describe('DetailBlock', () => {
  it('renders header and children correctly', () => {
    const props = {
      header: 'Test title',
      children: <div>children</div>
    }
    const wrapper = mount(<DetailBlock {...props} />)
    expect(wrapper.find('h2').text()).toEqual(props.header)
    expect(wrapper.find('.DetailBlock > div:last-child').prop('children')).toEqual(props.children)
  })

  it('passes className prop correctly', () => {
    const props = {
      header: 'Test title',
      className: 'test-classname',
      children: <div>children</div>
    }
    const wrapper = mount(<DetailBlock {...props} />)
    expect(wrapper.find('.DetailBlock').prop('className')).toContain(props.className)
  })

  it('renders header without wrapper tag if noHeaderWrap is set', () => {
    const props = {
      header: <div>Test title</div>,
      noHeaderWrap: true,
      children: <div>children</div>
    }
    const wrapper = mount(<DetailBlock {...props} />)
    expect(wrapper.find('.DetailBlock > h2').length).toBe(0)
    expect(wrapper.find('.DetailBlock').prop('children')).toContain(props.header)
  })
})
