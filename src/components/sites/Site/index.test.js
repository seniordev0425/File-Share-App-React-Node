import React from 'react'
import { shallow, mount } from 'enzyme'
import { Map } from 'immutable'
import { MemoryRouter as Router } from 'react-router-dom'

import NotFound from 'components/common/NotFound'
import Spinner from 'components/common/Spinner'
import {
  REQUEST_STATUS,
  EXPIRATION_STATUS,
} from 'constants/common'
import { DetailData } from 'store/common/models'
import { Site as SiteModel, SitePreview } from 'store/modules/sites'
import { Site } from './index'

const props = {
  match: {
    params: {
      server: 'testserver.amfast.io'
    }
  },
  location: {
    pathname: '/sites/testserver.amfast.io'
  },
  siteDetail: DetailData(),
  sitePreviewMap: Map(),
  storageDetail: DetailData(),
  loadSiteDetail: e => e,
  loadSitePreview: e => e,
  loadStorageDetail: e => e,
  updateSiteDetail: e => e,
}

/* Mock subviews */
jest.mock('../SiteOverview', () => () => {
  const React = require('react')
  return <div className="siteOverviewMock" />
})
jest.mock('../SiteBrowse', () => () => {
  const React = require('react')
  return <div className="siteBrowseMock" />
})
jest.mock('../SiteAnalytics', () => () => {
  const React = require('react')
  return <div className="siteAnalyticsMock" />
})
jest.mock('../SiteDomain', () => () => {
  const React = require('react')
  return <div className="siteDomainMock" />
})
jest.mock('../SiteEvents', () => () => {
  const React = require('react')
  return <div className="siteEventsMock" />
})

it('renders loading state', () => {
  const localProps = {
    ...props,
    siteDetail: DetailData({
      state: REQUEST_STATUS.PENDING,
    }),
    loadSiteDetail: jest.fn(),
  }
  const wrapper = mount(<Router>
    <Site {...localProps} />
  </Router>)

  expect(wrapper.find(Spinner).length).toEqual(1)
  expect(localProps.loadSiteDetail).toHaveBeenCalled()
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
    <Site {...localProps} />
  </Router>)

  expect(wrapper.find(NotFound).length).toEqual(1)
})

it('renders subviews on appropriate routes when site loaded', () => {
  const routes = [
    props.location.pathname,
    `${props.location.pathname}/browse`,
    `${props.location.pathname}/analytics`,
    `${props.location.pathname}/domain`,
    `${props.location.pathname}/events`,
  ]
  const subviewMockCssSelectors = [
    '.siteOverviewMock',
    '.siteBrowseMock',
    '.siteAnalyticsMock',
    '.siteDomainMock',
    '.siteEventsMock',
  ]
  const localProps = {
    ...props,
    siteDetail: DetailData({
      data: SiteModel({
        server: props.match.params.server,
      }),
      state: REQUEST_STATUS.SUCCESS,
    })
  }

  for (let i = 0; i < routes.length; i += 1) {
    const wrapper = mount(<Router initialEntries={[{ pathname: routes[i] }]}>
      <Site {...localProps} />
    </Router>)

    // Route-matching subview should be rendered
    expect(wrapper.find(subviewMockCssSelectors[i]).length).toEqual(1)
    // Other subviews should not be rendered
    for (let j = 0; j < routes.length; j += 1) {
      if (i !== j) {
        expect(wrapper.find(subviewMockCssSelectors[j]).length).toEqual(0)
      }
    }
  }
})

it('reloads preview when expired', () => {
  const TestComponent = props => <Router>
    <Site {...props} />
  </Router>

  const localProps = {
    ...props,
    siteDetail: DetailData({
      data: SiteModel({
        server: props.match.params.server,
      }),
      state: REQUEST_STATUS.SUCCESS,
    }),
    sitePreviewMap: Map({
      [props.match.params.server]: DetailData({
        state: REQUEST_STATUS.SUCCESS,
        data: SitePreview({
          url: 'https://test.com/mock.png',
        }),
        expirationStatus: EXPIRATION_STATUS.NOT_EXPIRED,
        lastRequestPayload: Map({
          server: props.match.params.server,
        }),
      }),
      'test01.fast.io': DetailData({
        state: REQUEST_STATUS.SUCCESS,
        data: SitePreview({
          url: 'https://test.com/mock2.png',
        }),
        lastRequestPayload: Map({
          server: 'test01.fast.io',
        }),
      }),
    }),
    loadSitePreview: jest.fn(),
  }
  const wrapper = mount(<TestComponent {...localProps} />)

  expect(localProps.loadSitePreview).not.toHaveBeenCalled()

  const nextProps = {
    ...localProps,
    siteDetail: localProps.siteDetail.set(
      'expirationStatus',
      EXPIRATION_STATUS.EXPIRED,
    ),
    sitePreviewMap: localProps.sitePreviewMap.setIn(
      [props.match.params.server, 'expirationStatus'],
      EXPIRATION_STATUS.EXPIRED
    ),
  }
  wrapper.setProps(nextProps)

  expect(nextProps.loadSitePreview).toHaveBeenCalledWith({
    server: props.match.params.server,
    skipPendingState: true,
  })
})
