import React from 'react'
import { mount } from 'enzyme'
import { Toast } from 'reactstrap'

import { APP_VERSION } from 'constants/env'
import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { SystemStatus } from 'store/modules/system'
import { VersionChecker } from './index'


const props = {
  systemStatus: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: SystemStatus({
      frontEndVersion: APP_VERSION,
    })
  }),
  loadSystemStatus: e => e,
}

it('should not show outdated version alert when cached version equals system status', () => {
  const wrapper = mount(<VersionChecker {...props} />)

  expect(wrapper.find('div').length).toEqual(0)
})

it('should show outdated version alert when cached version is less than system status', () => {
  const localProps = {
    ...props,
    systemStatus: props.systemStatus.setIn(['data', 'frontEndVersion'], APP_VERSION + '.1')
  }
  const wrapper = mount(<VersionChecker {...localProps} />)

  expect(wrapper.find(Toast).length).toEqual(1)
})
