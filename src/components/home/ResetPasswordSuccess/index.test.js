import React from 'react'
import { shallow } from 'enzyme'
import { Button } from 'reactstrap'
import { REQUEST_STATUS } from 'constants/common'
import {ResetPasswordSuccess} from './index'



describe('render reset password success page', () => {
  it('should render component', () => {

    const localProps = {
      resetPasswordInitial: jest.fn()
    }

    const wrapper = shallow(<ResetPasswordSuccess {...localProps} />)
    expect(wrapper.find(Button).length).not.toEqual(0)

    wrapper.find(Button).simulate('click')
    expect(localProps.resetPasswordInitial).toHaveBeenCalledWith(REQUEST_STATUS.INITIAL)

  })
})