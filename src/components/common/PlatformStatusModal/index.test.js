import React from 'react'
import { mount } from 'enzyme'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { SystemStatus } from 'store/modules/system'
import PlatformStatusModal from './index'


const props = {
  open: false,
  onClose: e => e,
  systemStatus: DetailData(),
  frontendVersion: '1.1.0',
}

it('renders initial state with hidden modal', () => {
  const wrapper = mount(<PlatformStatusModal {...props} />)

  expect(wrapper.find('div').length).toEqual(0)
  expect(wrapper.text()).toBeFalsy()
})

it('renders loadeded state with hidden modal', () => {
  const localProps = {
    ...props,
    open: true,
    systemStatus: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: SystemStatus({
        app: 'ok',
        api: 'ok',
        cdn: 'ok',
        analytics: 'ok',
        version: '1.108-7b4179c15f',
      }),
    })
  }

  const wrapper = mount(<PlatformStatusModal {...localProps} />)

  expect(wrapper.text()).toContain('App: ok')
  expect(wrapper.text()).toContain('API: ok')
  expect(wrapper.text()).toContain('CDN: ok')
  expect(wrapper.text()).toContain('Analytics: ok')
  expect(wrapper.text()).toContain(`Platform Version: ${localProps.systemStatus.data.version}`)
  expect(wrapper.text()).toContain(`Frontend Version: ${localProps.frontendVersion}`)
})
