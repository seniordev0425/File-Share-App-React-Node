import React from 'react'
import { mount } from 'enzyme'

import FormSwitch from './index'


const props = {
  input: {
    name: 'testfield',
    value: false,
    onChange: e => e,
    onBlur: e => e,
  },
}

describe('FormSwitch', () => {
  it('renders correct input element', () => {
    const wrapper = mount(<FormSwitch {...props} />)

    expect(wrapper.find('input').prop('name')).toEqual(props.input.name)
    expect(wrapper.find('input').prop('value')).toEqual(props.input.value)
  })

  it('renders disabled state correctly', () => {
    const wrapper = mount(<FormSwitch {...props} disabled />)

    expect(wrapper.find('input').prop('disabled')).toEqual(true)
    expect(wrapper.find('input').prop('checked')).toEqual(false)
  })

  it('handles onchange event', () => {
    const localProps = {
      ...props,
    }
    localProps.input.onChange = jest.fn()
    localProps.input.onBlur = jest.fn()

    const wrapper = mount(<FormSwitch {...localProps} />)

    wrapper.find('input').simulate('change', { target: { checked: true } })
    expect(localProps.input.onChange).toHaveBeenCalled()
    wrapper.find('input').simulate('blur')
    expect(localProps.input.onBlur).toHaveBeenCalled()
  })
})
