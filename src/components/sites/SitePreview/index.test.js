import React from 'react'
import { mount } from 'enzyme'

import SitePreview from './index'

const props = {
  imageUrl: 'http://test.com/1.png'
}

it('renders initial state', () => {
  const wrapper = mount(<SitePreview {...props} />)

  expect(wrapper.find('div').length).not.toEqual(0)
})

it('renders initial state without image', () => {
  const wrapper = mount(<SitePreview imageUrl={null} />)

  expect(wrapper.find('div').length).not.toEqual(0)
})

it('renders open state', () => {
  const wrapper = mount(<SitePreview {...props} />)

  wrapper.find('div').at(1).simulate('click')

  expect(wrapper.find('img').prop('src')).toEqual(props.imageUrl)
})
