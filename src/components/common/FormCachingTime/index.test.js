import React from 'react'
import { mount } from 'enzyme'

import FormCachingTime from './index';


const props = {
  input: {
    name: 'testfield',
    value: 30,
    onChange: e => e,
    onBlur: e => e,
  },
}

describe('FormCachingTime', () => {
  it('renders correct input element', () => {
    const wrapper = mount(<FormCachingTime {...props} />)
  
    expect(wrapper.find('input[type="number"]').prop('name')).toEqual(props.input.name)
    expect(wrapper.find('input[type="number"]').prop('value')).toEqual(props.input.value)
    expect(wrapper.find('select').prop('value')).toEqual('seconds')
  })

  it('renders the value in minutes if value is multiple of one minute', () => {
    const localProps = {
      ...props,
      input: {
        ...props.input,
        value: 60 * 2
      }
    }
    const wrapper = mount(<FormCachingTime {...localProps} />)

    expect(wrapper.find('input[type="number"]').prop('value')).toEqual(2)
    expect(wrapper.find('select').prop('value')).toEqual('minutes')
  })

  it('renders the value in hours if value is multiple of one minute', () => {
    const localProps = {
      ...props,
      input: {
        ...props.input,
        value: 3600 * 2
      }
    }
    const wrapper = mount(<FormCachingTime {...localProps} />)

    expect(wrapper.find('input[type="number"]').prop('value')).toEqual(2)
    expect(wrapper.find('select').prop('value')).toEqual('hours')
  })

  it('renders the value in days if value is multiple of one minute', () => {
    const localProps = {
      ...props,
      input: {
        ...props.input,
        value: 86400 * 2
      }
    }
    const wrapper = mount(<FormCachingTime {...localProps} />)

    expect(wrapper.find('input[type="number"]').prop('value')).toEqual(2)
    expect(wrapper.find('select').prop('value')).toEqual('days')
  })

  it('handles onchange and onblur events', () => {
    const localProps = {
      ...props,
    }
    localProps.input.onChange = jest.fn()
    localProps.input.onBlur = jest.fn()
  
    const wrapper = mount(<FormCachingTime {...localProps} />)
  
    wrapper.find('input[type="number"]').simulate('change', { target: { value: 35 } })
    expect(localProps.input.onChange).toHaveBeenCalled()
    wrapper.find('input').simulate('blur')
    expect(localProps.input.onBlur).toHaveBeenCalled()
  })
})
