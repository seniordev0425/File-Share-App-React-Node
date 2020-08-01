import React from 'react'
import { act } from 'react-dom/test-utils'


export const changeInputValue = (inputWrapper, value) => {
  inputWrapper.simulate('change', {
    target: {
      type: inputWrapper.getDOMNode().type,
      name: inputWrapper.getDOMNode().name,
      value,
    }
  })
}

export const changeCheckboxValue = (inputWrapper, value) => {
  inputWrapper.simulate('change', {
    target: {
      type: inputWrapper.getDOMNode().type,
      name: inputWrapper.getDOMNode().name,
      checked: value,
    }
  })
}

export const timeoutPromise = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const submitWizardStep = wrapper => {
  wrapper.find('form').simulate('submit')
  act(() => {
    jest.advanceTimersByTime(600)
  })
  wrapper.update()    // Hack to avoid out-of-sync issue between enzyme wrapper tree and jest DOM tree
}

export const prepareRenderContainer = () => {
  const id = 'render-container'
  let container = document.getElementById(id)
  if (container) {
    return container
  }
  container = document.createElement('div')
  container.setAttribute('id', id)
  document.body.append(container)
  return container
}
