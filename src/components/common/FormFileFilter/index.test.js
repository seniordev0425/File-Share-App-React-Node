import React from 'react'
import { mount } from 'enzyme'
import { FormFeedback } from 'reactstrap'

import FormFileFilter from './index'


const props = {
  input: {
    name: 'testfield',
    value: '/(\\/\\.|\\/\\~|.*(\\n|\\r).*)|(\\/desktop\\.ini$|^thumbs\\.db|icon\\r)/',
    onChange: e => e,
    onBlur: e => e,
  },
  meta: {}
}

describe('FormFileFilter', () => {
  it('renders excluded files list correctly', () => {
    const wrapper = mount(<FormFileFilter {...props} />)
    const texts = wrapper.find('.js-item-text').children().map(item => item.text())
    expect(texts).toEqual([
      '/., /~, *(\\n, \\r)*',
      '/desktop.ini, thumbs.db, icon\\r',
    ])
  })

  it('renders error message correctly', () => {
    const localProps = {
      ...props,
      meta: {
        touched: true,
        error: 'At least one filter is required'
      }
    }
    const wrapper = mount(<FormFileFilter {...localProps} />)
    expect(wrapper.find(FormFeedback).text()).toEqual(localProps.meta.error)
  })

  it('triggers onChange with correct regular expressions', () => {
    const localProps = {
      ...props,
      input: {
        ...props.input,
        onChange: jest.fn(),
      }
    }
    const wrapper = mount(<FormFileFilter {...localProps} />)
    wrapper.find('input.js-input-exclude').simulate('change', { target: { value: '*.git' } })
    wrapper.find('button.js-btn-exclude').simulate('click')
    expect(localProps.input.onChange).toHaveBeenCalledWith(
      '/(\\/\\.|\\/\\~|.*(\\n|\\r).*)|(\\/desktop\\.ini$|^thumbs\\.db|icon\\r)|(^.*\\.git$)/'
    )
  })

  it('prevents adding of the empty filter string', () => {
    const localProps = {
      ...props,
      input: {
        ...props.input,
        value: '(^.*\\.git$)',
        onChange: jest.fn(),
      }
    }
    const wrapper = mount(<FormFileFilter {...localProps} />)
    wrapper.find('input.js-input-exclude').simulate('change', { target: { value: '' } })
    wrapper.find('button.js-btn-exclude').simulate('click')
    expect(localProps.input.onChange).not.toHaveBeenCalled()
  })

  it('prevents adding of the same filter string twice', () => {
    const localProps = {
      ...props,
      input: {
        ...props.input,
        value: '/(^.*\\.git$)/',
        onChange: jest.fn(),
      }
    }
    const wrapper = mount(<FormFileFilter {...localProps} />)
    wrapper.find('input.js-input-exclude').simulate('change', { target: { value: '*.git' } })
    wrapper.find('button.js-btn-exclude').simulate('click')
    expect(localProps.input.onChange).not.toHaveBeenCalled()
  })
})
