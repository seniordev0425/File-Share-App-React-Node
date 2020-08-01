import React from 'react'
import { mount } from 'enzyme'
import { Map, List } from 'immutable'
import { MemoryRouter as Router } from 'react-router-dom'

import {
  REQUEST_STATUS,
  EXPIRATION_STATUS,
} from 'constants/common'
import { DetailData } from 'store/common/models'
import { Site, SitePreview } from 'store/modules/sites'
import { SiteStatsRecord, SiteStats } from 'store/modules/siteStats'
import { SiteListItem } from './index'

jest.mock('components/common/StatsMiniChart', () => () => <span />)

const props = {
  userTitle: 'TT',
  site: Site({
    server: 'test.fast.io',
    enabled: true,
  }),
  sitePreviewMap: Map(),
  siteMiniGraphStatsMap: Map(),
  loadSitePreview: e => e,
  loadSiteMiniGraphStats: e => e,
  updateSiteDetail: e => e,
}

const data = {
  sitePreviewMap: Map({
    [props.site.server]: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: SitePreview({
        url: 'https://test.com/mock.png',
      }),
      lastRequestPayload: Map({
        server: props.site.server,
      }),
    })
  }),
  siteMiniGraphStatsMap: Map({
    [props.site.server]: DetailData({
      state: REQUEST_STATUS.SUCCESS,
      data: SiteStats({
        server: '',
        results: 0,
        interval: 0,
        transfers: List([
          SiteStatsRecord({
            transfers: 3,
            bytes: 1500,
            start: '2019-05-01 10:00:00 UTC',
            end: '2019-05-01 10:00:30 UTC',
          }),
          SiteStatsRecord({
            transfers: 2,
            bytes: 10240,
            start: '2019-05-02 05:00:00 UTC',
            end: '2019-05-02 05:01:10 UTC',
          }),
        ]),
      }),
      lastRequestPayload: Map({
        server: props.site.server,
      }),
    })
  })
}

it('renders initial state', () => {
  const localProps = {
    ...props,
    loadSitePreview: jest.fn(),
    loadSiteMiniGraphStats: jest.fn(),
  }
  const wrapper = mount(<Router>
    <SiteListItem {...localProps} />
  </Router>)

  expect(wrapper.find('div').length).not.toEqual(0)
  expect(localProps.loadSitePreview).toHaveBeenCalledWith({
    server: localProps.site.server,
  })
  expect(localProps.loadSiteMiniGraphStats).toHaveBeenCalledWith({
    server: localProps.site.server,
  })
})

it('renders loading state', () => {
  const localProps = {
    ...props,
    sitePreviewMap: Map({
      [props.site.server]: DetailData({
        state: REQUEST_STATUS.PENDING,
      })
    }),
    siteMiniGraphStatsMap: Map({
      [props.site.server]: DetailData({
        state: REQUEST_STATUS.PENDING,
      })
    }),
  }
  const wrapper = mount(<Router>
    <SiteListItem {...localProps} />
  </Router>)

  expect(wrapper.find('div').length).not.toEqual(0)
})

it('renders loaded state', () => {
  const localProps = {
    ...props,
    ...data,
    loadSitePreview: jest.fn(),
    loadSiteMiniGraphStats: jest.fn(),
  }
  const wrapper = mount(<Router>
    <SiteListItem {...localProps} />
  </Router>)

  expect(wrapper.find('div').length).not.toEqual(0)
  expect(localProps.loadSitePreview).not.toHaveBeenCalled()
  expect(localProps.loadSiteMiniGraphStats).not.toHaveBeenCalled()
})

it('reloads preview when expired', () => {
  const TestComponent = props => <Router>
    <SiteListItem {...props} />
  </Router>

  const localProps = {
    ...props,
    sitePreviewMap: Map({
      [props.site.server]: DetailData({
        state: REQUEST_STATUS.SUCCESS,
        data: SitePreview({
          url: 'https://test.com/mock.png',
        }),
        expirationStatus: EXPIRATION_STATUS.NOT_EXPIRED,
        lastRequestPayload: Map({
          server: props.site.server,
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

  expect(wrapper.find('div').length).not.toEqual(0)
  expect(localProps.loadSitePreview).not.toHaveBeenCalled()

  const nextProps = {
    ...localProps,
    sitePreviewMap: localProps.sitePreviewMap.setIn(
      [props.site.server, 'expirationStatus'],
      EXPIRATION_STATUS.EXPIRED
    ),
  }
  wrapper.setProps(nextProps)

  expect(localProps.loadSitePreview).toHaveBeenCalledWith({
    server: props.site.server,
    skipPendingState: true,
  })
})
