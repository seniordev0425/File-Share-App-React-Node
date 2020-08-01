import React from 'react'
import { Map } from 'immutable'
import { mount, shallow } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import { REQUEST_STATUS } from 'constants/common'
import { DetailData } from 'store/common/models'
import { Site } from 'store/modules/sites'
import { SiteSettings } from './index'
import { planDetail } from 'test/fixtures/billing'
import { storages } from 'test/fixtures/storage'
import { sitePreviewDetail } from 'test/fixtures/sites'
import NotFound from 'components/common/NotFound'
import Spinner from 'components/common/Spinner'
import SitePreview from 'components/sites/SitePreview'

jest.mock('components/common/ConfirmationModal')
jest.mock('../SiteSettingsForm')

import SiteSettingsForm from '../SiteSettingsForm'

const server = 'test-serfer.imfast.io'

const props = {
  match: { params: { server } },
  location: {},
  history: { push: () => {} },
  user: DetailData(),
  siteDetail: DetailData({
    state: REQUEST_STATUS.INITIAL,
    server,
  }),
  sitePreviewMap: Map({
    [server]: sitePreviewDetail
  }),
  plan: planDetail,
  myStorageList: DetailData(),
  updateSiteDetailState: REQUEST_STATUS.INITIAL,
  deleteSiteDetailState: REQUEST_STATUS.INITIAL,
  loadPlan: e => e,
  loadSiteDetail: e => e,
  loadSitePreview: e => e,
  loadMyStorageList: e => e,
  updateSiteDetail: e => e,
  deleteSiteDetail: e => e,
}

const dummySiteData = {
  name: 'test-server',
  autoupdate: true,
  enabled: true,
  fancyindexing: false,
  indexfiles: true,
  locked: false,
  precache: true,
  precachedata: true,
  search: true,
  server: 'test-server.imfast.io',
  storage: 'dropbox',
}

const data = {
  myStorageList: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: storages
  }),
  siteDetail: DetailData({
    state: REQUEST_STATUS.SUCCESS,
    data: Site(dummySiteData)
  }),
}

it('renders loading state when site detail not loaded', () => {
  const localProps = {
    ...props,
    siteDetail: DetailData({
      state: REQUEST_STATUS.PENDING,
    }),
    loadSiteDetail: jest.fn(),
  }
  const wrapper = mount(<Router>
    <SiteSettings {...localProps} />
  </Router>)

  expect(wrapper.find(Spinner).length).toEqual(1)
})

it('renders loading state when storage list not loaded', () => {
  const localProps = {
    ...props,
    siteDetail: data.siteDetail,
    loadSiteDetail: jest.fn(),
  }
  const wrapper = mount(<Router>
    <SiteSettings {...localProps} />
  </Router>)

  expect(wrapper.find(Spinner).length).toEqual(1)
})

it('renders failed state', () => {
  const localProps = {
    ...props,
    siteDetail: DetailData({
      state: REQUEST_STATUS.FAIL,
      statusCode: 404,
    })
  }
  const wrapper = mount(<Router>
    <SiteSettings {...localProps} />
  </Router>)

  expect(wrapper.find(NotFound).length).toEqual(1)
})


it('renders failed state', () => {
  const localProps = {
    ...props,
    siteDetail: DetailData({
      state: REQUEST_STATUS.FAIL,
    })
  }

  const wrapper = shallow(<SiteSettings {...localProps} />)

  expect(wrapper.find(Spinner).length).not.toEqual(0)
})

it('renders loaded state', () => {
  const localProps = {
    ...props,
    ...data,
  }

  const wrapper = shallow(<SiteSettings {...localProps} />)

  expect(wrapper.find(SiteSettingsForm)).not.toEqual(0)
})

it('renders site preview image', () => {
  const localProps = {
    ...props,
    ...data,
  }
  const wrapper = shallow(<SiteSettings {...localProps} />)
  expect(wrapper.find(SitePreview).prop('imageUrl')).toEqual(sitePreviewDetail.data.url)
})
