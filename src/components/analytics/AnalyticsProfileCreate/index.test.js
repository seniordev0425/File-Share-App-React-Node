import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { REQUEST_STATUS } from 'constants/common'
import { AnalyticsProfileCreate } from './index'

jest.mock('../AnalyticsProfileCreateForm', () => () => <form />)
import AnalyticsProfileCreateForm from '../AnalyticsProfileCreateForm'


it('should go through wizard to create profile', () => {
  const props = {
    createProfileState: REQUEST_STATUS.INITIAL,
    createAnalyticsProfile: jest.fn(),
  }
  const wrapper = mount(<Router>
    <AnalyticsProfileCreate {...props} />
  </Router>)

  const testData = {
    name: 'someanalytics',
    token: 'UA-12345678-1'
  }
  wrapper.find(AnalyticsProfileCreateForm).prop('onSubmit')(testData)
  expect(props.createAnalyticsProfile).toHaveBeenCalledWith({
    data: {
      provider: 'googleanalytics',
      ...testData,
    }
  })
})
