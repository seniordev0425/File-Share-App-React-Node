import React from 'react'
import { mount } from 'enzyme'
import { EmptyList } from './index'

import { REQUEST_STATUS } from 'constants/common'
import { storageDetail } from 'test/fixtures/storage'
import { pathDetails } from 'test/fixtures/siteContent'
import { DetailData } from 'store/common/models'
import Spinner from 'components/common/Spinner'


const props = {
  server: 'test.fast.io',
  path: '/',
  storage: null,
  pathDetails: DetailData(),
  loadPathDetails: e => e,
}

const data = {
  storage: storageDetail,
  pathDetails: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: pathDetails,
  }),
}

it('should render spinner when storage detail not found', () => {
  const wrapper = mount(<EmptyList {...props} />)

  expect(wrapper.find(Spinner).length).toEqual(1)
})

it('should render spinner when path detail not loaded', () => {
  const localProps = {
    ...props,
    storage: data.storage,
  }
  const wrapper = mount(<EmptyList {...localProps} />)

  expect(wrapper.find(Spinner).length).toEqual(1)
})

it('should render message', () => {
  const localProps = {
    ...props,
    ...data,
  }
  const wrapper = mount(<EmptyList {...localProps} />)

  expect(wrapper.text()).toContain(
    `There are no files in this folder. To add files or folders, please go to your ${storageDetail.display} folder.`
  )
  expect(wrapper.find('a').prop('href')).toEqual(pathDetails.details.origin_url)
})
