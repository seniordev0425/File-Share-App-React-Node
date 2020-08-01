import React from 'react'
import { mount } from 'enzyme'
import { Input, Button } from 'reactstrap'

import TogglingInputField from './index'


const props = {
  value: 'testvalue',
  onChange: jest.fn(),
}

it('renders initial state', () => {
  const wrapper = mount(<TogglingInputField {...props} />)

  expect(wrapper.find('a').length).not.toEqual(0)
  expect(wrapper.text()).toContain(props.value)
})

it('clicking edit button will toggle into editing state', () => {
  const wrapper = mount(<TogglingInputField {...props} />)

  wrapper.find('a').simulate('click')

  expect(wrapper.find(Input).length).not.toEqual(0)
  expect(wrapper.find(Input).props().value).toContain(props.value)
})

it('clicking save button after entering value in editing state will invoke onChange', () => {
  const modifiedValue = 'modifiedvalue'

  props.onChange.mockReset()
  const wrapper = mount(<TogglingInputField {...props} />)

  wrapper.find('a').simulate('click')
  wrapper.find(Input).simulate('change', {
    target: { value: modifiedValue },
  })
  wrapper.find(Button).at(1).simulate('click')

  expect(props.onChange).toHaveBeenCalledWith(modifiedValue)

  wrapper.setProps({
    ...props,
    value: modifiedValue,
  })
  wrapper.find('a').simulate('click')
  expect(wrapper.find(Input).prop('value')).toEqual(modifiedValue)
})

it('pressing esc key in editing state will cancel edit mode without invoking onChange', () => {
  const modifiedValue = 'modifiedvalue'

  props.onChange.mockReset()
  const wrapper = mount(<TogglingInputField {...props} />)

  wrapper.find('a').simulate('click')
  wrapper.find(Input).simulate('change', {
    target: { value: modifiedValue },
  })
  wrapper.find(Input).simulate('keyup', {
    keyCode: 27,    // ESC key
  })

  expect(props.onChange).not.toHaveBeenCalled()

  wrapper.find('a').simulate('click')
  expect(wrapper.find(Input).prop('value')).toEqual(props.value)
})

it('clicking cancel button in editing state will cancel edit mode without invoking onChange', () => {
  const modifiedValue = 'modifiedvalue'

  props.onChange.mockReset()
  const wrapper = mount(<TogglingInputField {...props} />)

  wrapper.find('a').simulate('click')
  wrapper.find(Input).simulate('change', {
    target: { value: modifiedValue },
  })
  wrapper.find(Button).at(0).simulate('click')

  expect(props.onChange).not.toHaveBeenCalled()

  wrapper.find('a').simulate('click')
  expect(wrapper.find(Input).prop('value')).toEqual(props.value)
})
